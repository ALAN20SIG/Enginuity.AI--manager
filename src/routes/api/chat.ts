import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, stepCountIs, tool, type UIMessage } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM = `You are Enginuity, an AI Engineering Manager, Tech Lead, and Product Manager.
You serve a B2B SaaS engineering organization. You have LIVE tools:
- Linear: linear_list_teams, linear_list_issues, linear_create_issue
- Notion: notion_search (find pages/databases), notion_get_page (page metadata + properties), notion_get_page_content (extract plain text from blocks)
Prefer tools over guessing. When asked about planning, specs, PRDs, runbooks, or documentation quality, search Notion first, fetch the relevant pages, then summarize. Flag missing sections (e.g. no acceptance criteria, no rollout plan, stale > 90 days).
Cite Linear identifiers (ENG-123) and Notion page titles + URLs when you have them. Use crisp markdown.
Demo context (mocked): sprint "Alpha Phoenix" (S25), health 92/100, cycle time 3.2d, 142 open PRs across 8 repos.`;

const GATEWAY = "https://connector-gateway.lovable.dev/linear/graphql";
const NOTION_GATEWAY = "https://connector-gateway.lovable.dev/notion/v1";

async function notionFetch(path: string, init?: { method?: string; body?: unknown }) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const notionKey = process.env.NOTION_API_KEY;
  if (!lovableKey || !notionKey) throw new Error("Notion connection not configured");
  const res = await fetch(`${NOTION_GATEWAY}${path}`, {
    method: init?.method ?? "GET",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": notionKey,
      "Content-Type": "application/json",
    },
    body: init?.body ? JSON.stringify(init.body) : undefined,
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Notion ${res.status}: ${text.slice(0, 300)}`);
  return JSON.parse(text);
}

type NotionRichText = { plain_text?: string };

type NotionBlock = {
  type: string;
  [key: string]: unknown;
};

type NotionSearchResult = {
  id: string;
  object: string;
  url: string;
  last_edited_time: string;
  title?: NotionRichText[];
  properties?: Record<
    string,
    {
      title?: NotionRichText[];
      type?: string;
      rich_text?: NotionRichText[];
    }
  >;
};

function richTextToPlain(rt: NotionRichText[] = []) {
  return rt.map((r) => r.plain_text ?? "").join("");
}

function titleOfPage(page: { properties?: NotionSearchResult["properties"] }) {
  const props = page.properties ?? {};
  for (const v of Object.values(props)) {
    if (v.type === "title" && v.title) return richTextToPlain(v.title);
  }
  return "(untitled)";
}

function blockToText(block: NotionBlock): string {
  const t = block.type;
  const node = block[t] as Record<string, unknown> | undefined;
  if (!node) return "";
  const richText = node.rich_text;
  if (Array.isArray(richText)) {
    const txt = richTextToPlain(richText as NotionRichText[]);
    if (t === "heading_1") return `\n# ${txt}\n`;
    if (t === "heading_2") return `\n## ${txt}\n`;
    if (t === "heading_3") return `\n### ${txt}\n`;
    if (t === "bulleted_list_item") return `- ${txt}\n`;
    if (t === "numbered_list_item") return `1. ${txt}\n`;
    if (t === "to_do") return `- [${node.checked ? "x" : " "}] ${txt}\n`;
    if (t === "quote") return `> ${txt}\n`;
    if (t === "code") return `\n\`\`\`${node.language ?? ""}\n${txt}\n\`\`\`\n`;
    return `${txt}\n`;
  }
  return "";
}

async function linearGraphQL(query: string, variables?: Record<string, unknown>) {
  const lovableKey = process.env.LOVABLE_API_KEY;
  const linearKey = process.env.LINEAR_API_KEY;
  if (!lovableKey || !linearKey) throw new Error("Linear connection not configured");
  const res = await fetch(GATEWAY, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${lovableKey}`,
      "X-Connection-Api-Key": linearKey,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`Linear ${res.status}: ${body.slice(0, 300)}`);
  const json = JSON.parse(body);
  if (json.errors) throw new Error(`Linear GraphQL: ${JSON.stringify(json.errors).slice(0, 300)}`);
  return json.data;
}

const linearTools = {
  linear_list_teams: tool({
    description: "List Linear teams in the workspace.",
    inputSchema: z.object({}),
    execute: async () => {
      const data = await linearGraphQL(`query { teams(first: 25) { nodes { id key name } } }`);
      return data.teams.nodes;
    },
  }),
  linear_list_issues: tool({
    description:
      "List Linear issues. Optional filters: assignee ('me' or user id), teamKey (e.g. 'ENG'), stateType ('triage'|'backlog'|'unstarted'|'started'|'completed'|'canceled'), limit (default 20).",
    inputSchema: z.object({
      assignee: z.string().optional(),
      teamKey: z.string().optional(),
      stateType: z.string().optional(),
      limit: z.number().int().min(1).max(50).optional(),
    }),
    execute: async ({ assignee, teamKey, stateType, limit = 20 }) => {
      const filter: Record<string, unknown> = {};
      if (assignee === "me") filter.assignee = { isMe: { eq: true } };
      else if (assignee) filter.assignee = { id: { eq: assignee } };
      if (teamKey) filter.team = { key: { eq: teamKey } };
      if (stateType) filter.state = { type: { eq: stateType } };
      const data = await linearGraphQL(
        `query($filter: IssueFilter, $first: Int!) {
          issues(filter: $filter, first: $first, orderBy: updatedAt) {
            nodes { id identifier title priority url
              state { name type } team { key name } assignee { name } updatedAt }
          }
        }`,
        { filter, first: limit },
      );
      return data.issues.nodes;
    },
  }),
  linear_create_issue: tool({
    description:
      "Create a Linear issue. Requires teamId (use linear_list_teams to find it) and title.",
    inputSchema: z.object({
      teamId: z.string(),
      title: z.string(),
      description: z.string().optional(),
      assigneeId: z.string().optional(),
      priority: z.number().int().min(0).max(4).optional(),
    }),
    execute: async (input) => {
      const data = await linearGraphQL(
        `mutation($input: IssueCreateInput!) {
          issueCreate(input: $input) {
            success
            issue { id identifier title url }
          }
        }`,
        { input },
      );
      return data.issueCreate;
    },
  }),
};

const notionTools = {
  notion_search: tool({
    description:
      "Search Notion pages/databases the integration has access to. Returns id, title, url, last_edited_time.",
    inputSchema: z.object({
      query: z.string().optional(),
      filter: z.enum(["page", "database"]).optional(),
      limit: z.number().int().min(1).max(25).optional(),
    }),
    execute: async ({ query, filter, limit = 10 }) => {
      const body: Record<string, unknown> = { page_size: limit };
      if (query) body.query = query;
      if (filter) body.filter = { value: filter, property: "object" };
      const data = await notionFetch("/search", { method: "POST", body });
      return (data.results ?? []).map((r: NotionSearchResult) => ({
        id: r.id,
        object: r.object,
        url: r.url,
        last_edited_time: r.last_edited_time,
        title: r.object === "page" ? titleOfPage(r) : richTextToPlain(r.title ?? []),
      }));
    },
  }),
  notion_get_page: tool({
    description: "Get a Notion page's metadata and properties by page id.",
    inputSchema: z.object({ pageId: z.string() }),
    execute: async ({ pageId }) => {
      const page = await notionFetch(`/pages/${pageId}`);
      return {
        id: page.id,
        url: page.url,
        title: titleOfPage(page),
        created_time: page.created_time,
        last_edited_time: page.last_edited_time,
        properties: page.properties,
      };
    },
  }),
  notion_get_page_content: tool({
    description:
      "Fetch a Notion page's block children and return concatenated markdown-ish text. Use to read the actual content of a page before summarizing.",
    inputSchema: z.object({
      pageId: z.string(),
      maxBlocks: z.number().int().min(1).max(200).optional(),
    }),
    execute: async ({ pageId, maxBlocks = 100 }) => {
      let cursor: string | undefined;
      const blocks: NotionBlock[] = [];
      while (blocks.length < maxBlocks) {
        const qs = new URLSearchParams({ page_size: "100" });
        if (cursor) qs.set("start_cursor", cursor);
        const data = await notionFetch(`/blocks/${pageId}/children?${qs.toString()}`);
        blocks.push(...(data.results ?? []));
        if (!data.has_more) break;
        cursor = data.next_cursor;
      }
      const text = blocks.slice(0, maxBlocks).map(blockToText).join("");
      return { blockCount: blocks.length, text: text.slice(0, 12000) };
    },
  }),
};

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { messages } = (await request.json()) as { messages?: UIMessage[] };
        if (!Array.isArray(messages)) {
          return new Response("Messages required", { status: 400 });
        }
        const key = process.env.LOVABLE_API_KEY;
        if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

        const gateway = createLovableAiGatewayProvider(key);
        const result = streamText({
          model: gateway("google/gemini-3-flash-preview"),
          system: SYSTEM,
          messages: await convertToModelMessages(messages),
          tools: { ...linearTools, ...notionTools },
          stopWhen: stepCountIs(50),
        });
        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});
