import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, stepCountIs, tool, type UIMessage } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM = `You are Enginuity, an AI Engineering Manager, Tech Lead, and Product Manager.
You serve a B2B SaaS engineering organization. You have LIVE Linear access via tools (linear_list_issues, linear_list_teams, linear_create_issue). Prefer calling tools over guessing. For non-Linear data (GitHub PRs, Slack, Notion) you may reference the demo context below.
Speak with the calm, instrument-grade tone of a senior staff engineer. Cite Linear identifiers (e.g. ENG-123), team names, and statuses when you have them. Surface risks and concrete next actions. Use crisp markdown.
Demo context (mocked): sprint "Alpha Phoenix" (S25), health 92/100, cycle time 3.2d, 142 open PRs across 8 repos.`;

const GATEWAY = "https://connector-gateway.lovable.dev/linear/graphql";

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
    description: "Create a Linear issue. Requires teamId (use linear_list_teams to find it) and title.",
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
          tools: linearTools,
          stopWhen: stepCountIs(50),
        });
        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});