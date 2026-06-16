import { createFileRoute } from "@tanstack/react-router";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";

const SYSTEM = `You are Enginuity, an AI Engineering Manager, Tech Lead, and Product Manager.
You serve a B2B SaaS engineering organization. You see live data (mocked for demo) from MCP servers connected to GitHub, Jira, Notion, Slack, Linear, PostgreSQL, and Google Drive.
Speak with the calm, instrument-grade tone of a senior staff engineer. Be specific: cite PR numbers, sprint names, story points, and team names when relevant. Surface risks, recommendations, and concrete action items. Use crisp markdown with bullets and short paragraphs.
Today the active sprint is "Alpha Phoenix" (S25), engineering health is 92/100, cycle time is 3.2d, and there are 142 open PRs across 8 repos. PR #833 (code-review agent v2) has a high security risk; PR #842 (auth session rotation) needs more tests; PR #824 (weekly report PDF export) has been blocked 4 days on the infra team's headless-chrome runner.`;

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
        });
        return result.toUIMessageStreamResponse({ originalMessages: messages });
      },
    },
  },
});