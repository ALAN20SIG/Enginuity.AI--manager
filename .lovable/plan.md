# Enginuity AI — Build Plan

A premium MCP-powered AI Engineering Manager SaaS in the "Instrument Flight Deck" direction. All pages built with realistic mock engineering data; real authentication via Lovable Cloud; AI Manager chat wired to Lovable AI Gateway.

## 1. Foundation

- Enable Lovable Cloud (auth + DB).
- Provision `LOVABLE_API_KEY` for the AI Gateway.
- Configure Google OAuth provider (email/password + Google).
- Install AI Elements (`conversation`, `message`, `prompt-input`, `shimmer`, `tool`, `response`).
- Add `recharts` for charts; lock in design tokens (emerald `#10b981`, amber `#f59e0b`, zinc surfaces, Inter Display + JetBrains Mono) in `src/styles.css` verbatim from the chosen prototype.

## 2. Auth & layout

- `/auth` — sign in / sign up (email + Google), forgot password, `/reset-password` page.
- `_authenticated/route.tsx` gate (managed pattern) wrapping the whole app.
- `AppShell` component: left sidebar (Main Console / Intelligence / Config sections), sticky top bar (search w/ `/` shortcut, SYSTEMS OPTIMAL pill, notifications, AI assistant button, team switcher, profile menu).

## 3. Pages (all under `_authenticated/`)

| Route | Content |
|---|---|
| `/` Dashboard | Engineering Health 92/100 radial + sub-scores, 6 KPI cards w/ sparklines, Velocity trend chart, Current Sprint kanban strip, AI Intelligence Stream sidebar |
| `/ai-manager` | Chat UI (AI Elements) — left conversation history (localStorage threads), center streaming chat, right context panel + suggested prompt cards |
| `/projects` | Grid/list toggle, project cards (health, risk, deadline, team), detail tabs (Overview / Tasks / PRs / Team / Risks / Docs) |
| `/sprints` | Sprint goal, burndown chart, team workload, AI risk cards |
| `/team-analytics` | Productivity charts, performance table, workload heatmap |
| `/pull-requests` | PR cards w/ AI review summary, merge readiness, risk score |
| `/risks` | Categorized risk dashboard + AI prediction cards |
| `/documentation` | Docs intelligence, AI summaries, missing sections |
| `/reports` | Generate weekly/sprint/exec/team reports + export actions |
| `/mcp-connections` | Integration cards (GitHub, Jira, Slack, Notion, Postgres, Linear, GDrive) + 5-step setup wizard |
| `/agents` | Multi-agent cards (Eng Manager, PM, Code Review, DevOps) w/ status/accuracy |
| `/notifications` | Unified feed |
| `/settings` | Team mgmt, roles, API keys, AI provider, MCP config |

## 4. AI Manager (live)

- Server route `src/routes/api/chat.ts` using `streamText` + `google/gemini-3-flash-preview` via Lovable AI Gateway provider helper (`src/lib/ai-gateway.server.ts`).
- System prompt frames the assistant as Enginuity AI's Engineering Manager with awareness of the mocked engineering data context.
- `useChat` client w/ `DefaultChatTransport`, render via AI Elements (`Conversation`, `Message`, `MessageResponse`, `PromptInput`, `Shimmer`).
- Conversation history: localStorage threads (no DB for chat in v1) with `/ai-manager/$threadId` route.

## 5. Mock data

Single `src/lib/mock/engineering-data.ts` with realistic repos, PRs, sprints, engineers, story points, risks, agents, integrations. All non-chat pages read from it. No database tables in v1 beyond what Cloud auth ships.

## 6. Logo & assets

- Generate Enginuity AI mark (geometric emerald glyph) as `src/assets/enginuity-logo.png`.
- Generate any inline placeholder images flagged in the prototype (sparklines, chart hero) into `src/assets/`.

## 7. Polish

- Smooth fade-up entrance animations from prototype kept verbatim.
- Recharts styled to match (emerald/amber on zinc, no default tooltips).
- Responsive: sidebar collapses on `<lg`.
- SEO `head()` per route.

## Out of scope (v1)

- Real MCP server connections (UI only, mock status).
- Real GitHub/Jira/Slack API calls.
- Database-backed multi-tenant orgs (auth only, single workspace).
- PDF export / email delivery for reports (UI buttons present, stub).

## Technical notes

- TanStack Start file routes, `createServerFn` for any future server logic, server route only for `/api/chat`.
- All colors via semantic tokens; no hardcoded `bg-zinc-*` outside `styles.css` token defs where avoidable (small overrides allowed since prototype uses them).
- `stepCountIs(50)` if/when tools added later; v1 chat is tool-less.
