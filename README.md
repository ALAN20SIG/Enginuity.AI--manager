# Enginuity AI

A premium MCP-powered AI Engineering Manager SaaS. Enginuity AI gives engineering leaders a real-time command center for health, velocity, risks, and team intelligence — augmented by an AI Manager that can query live Linear issues and Notion documentation through Lovable-managed connectors.

> **In one sentence:** Enginuity AI is an AI-powered engineering management command center that surfaces real-time team health, velocity, risks, and actionable intelligence through a conversational manager interface.

![Tech Stack](https://img.shields.io/badge/TanStack%20Start-v1-blue?logo=react)
![React](https://img.shields.io/badge/React-19-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-blue?logo=tailwindcss)

## What is Enginuity AI?

Enginuity AI is an "instrument flight deck" for engineering managers. It combines:

- **Engineering Health & KPIs** — a single score plus velocity, cycle time, PR throughput, and sprint burndown.
- **AI Manager Chat** — a conversational assistant that can fetch and summarize live Linear issues and Notion pages, and produce reports grounded in real data.
- **Planning & Documentation Intelligence** — search Notion pages, surface missing sections, stale specs, and documentation quality gaps.
- **Risk & Workload Signals** — AI-generated risk cards, team workload heatmaps, and merge-readiness summaries.
- **MCP Connectivity** — integration cards and setup flows for Linear, Notion, Jira, Slack, Postgres, and Google Drive.

> **Note:** The current release uses realistic mocked engineering data for the dashboard, projects, sprints, and analytics. The AI Manager can optionally connect to live Linear and Notion workspaces through Lovable connectors.

## Tech Stack

- **Framework:** [TanStack Start v1](https://tanstack.com/start) — full-stack React 19 with SSR/SSG and edge-friendly server functions.
- **Build Tool:** Vite 7
- **Styling:** Tailwind CSS v4 (native CSS `@import` / theme variables)
- **UI Components:** shadcn/ui + Radix UI primitives
- **Charts:** Recharts
- **Backend / Auth:** Lovable Cloud (Supabase)
- **AI:** Lovable AI Gateway via `ai-sdk` (`google/gemini-3-flash-preview`)
- **Language:** TypeScript 5.8 (strict mode)
- **Package Manager:** Bun (lockfile: `bun.lock`)

## Features

| Area                | Capability                                                                                                             |
| ------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Dashboard**       | Engineering Health score (92/100), KPI sparklines, velocity trend, current sprint kanban strip, AI intelligence stream |
| **AI Manager**      | Streaming chat, thread history, suggested prompts, live Linear/Notion tool calling                                     |
| **Projects**        | Grid/list views, project cards with health, risk, deadline, team, and detail tabs                                      |
| **Sprints**         | Sprint goal, burndown chart, team workload, AI risk cards                                                              |
| **Team Analytics**  | Productivity charts, performance table, workload heatmap                                                               |
| **Pull Requests**   | PR cards with AI review summary, merge readiness, risk score                                                           |
| **Risks**           | Categorized risk dashboard + AI prediction cards                                                                       |
| **Documentation**   | Docs intelligence, AI summaries, missing-section detection                                                             |
| **Reports**         | Weekly / sprint / exec / team report generation + export actions                                                       |
| **MCP Connections** | Connector cards + 5-step setup wizard                                                                                  |
| **Agents**          | Multi-agent cards (Eng Manager, PM, Code Review, DevOps) with status & accuracy                                        |
| **Notifications**   | Unified activity feed                                                                                                  |
| **Command Palette**   | Global ⌘K / Ctrl+K / `/` command palette for instant navigation, AI Manager, and sign-out                              |
| **Settings**        | Team management, roles, API keys, AI provider, MCP config                                                              |

## Architecture Overview

Enginuity AI is structured as three cooperating layers: a **presentation layer** (TanStack Start routes + shadcn UI), a **data layer** (Lovable Cloud / Supabase + mocked engineering data), and an **AI + MCP layer** (Lovable AI Gateway + connector-backed tools).

```text
┌──────────────────────────────────────────────────────────┐
│  Presentation Layer (React 19 + TanStack Start)          │
│  - _authenticated/* routes (Dashboard, Sprints, PRs...)  │
│  - AppShell, PageHeader, shadcn/ui, Recharts             │
└───────────────┬──────────────────────────┬───────────────┘
                │                          │
                │ useChat / fetch          │ server functions
                ▼                          ▼
┌──────────────────────────────┐ ┌────────────────────────┐
│  AI Manager                  │ │  Data Layer            │
│  /api/chat (streamText)      │ │  Supabase Auth + RLS   │
│  Lovable AI Gateway          │ │  mock/engineering-data │
│  google/gemini-3-flash       │ │  createServerFn (RPC)  │
└───────────────┬──────────────┘ └────────────┬───────────┘
                │ tool calls                  │
                ▼                             │
┌──────────────────────────────┐              │
│  MCP Workflow                │              │
│  connector-gateway.lovable   │              │
│  Linear (GraphQL)            │◄─────────────┘
│  Notion (REST v1)            │  shared auth/session
└──────────────────────────────┘
```

### Core modules

**1. AI Manager (`src/routes/_authenticated/ai-manager.tsx` + `src/routes/api/chat.ts`)**
The conversational surface. The UI uses the Vercel AI SDK's `useChat` to stream messages from `/api/chat`, a TanStack Start server route that calls Lovable AI Gateway (`google/gemini-3-flash-preview`) via `createLovableAiGatewayProvider` (`src/lib/ai-gateway.server.ts`). The system prompt frames the model as an Engineering Manager and instructs it to prefer tools over guessing.

**2. Data layer (`src/lib/mock/engineering-data.ts`, `src/integrations/supabase/*`)**
Two sources feed the UI:

- **Mocked engineering data** — sprints, projects, PRs, risks, KPIs consumed by dashboard/analytics routes. Deterministic and SSR-safe.
- **Lovable Cloud (Supabase)** — auth + session, with `_authenticated/route.tsx` gating protected routes. Server functions use `requireSupabaseAuth` middleware (attached globally in `src/start.ts`) so RPC calls carry the user's bearer token.

**3. MCP workflow (`src/routes/api/chat.ts` tools + `src/routes/_authenticated/mcp-connections.tsx`)**
The chat route registers two tool families that proxy through `connector-gateway.lovable.dev`:

- `linear_*` — GraphQL queries/mutations against Linear (teams, issues, create issue).
- `notion_*` — REST calls to Notion for search, page metadata, and block content.
  Each tool injects `LOVABLE_API_KEY` (gateway auth) and the per-connector key (`LINEAR_API_KEY`, `NOTION_API_KEY`) server-side; secrets never reach the browser. The MCP Connections page is the user-facing setup surface for these connectors.

### Request flow: a chat turn that reads Notion

1. User types a question in `ai-manager.tsx`; `useChat` POSTs the message thread to `/api/chat`.
2. `streamText` invokes the Gemini model through Lovable AI Gateway.
3. Model decides to call `notion_search`, then `notion_get_page_content`.
4. Each tool runs server-side, fetches via the connector gateway, and returns compact JSON to the model.
5. The model composes a grounded answer; tokens stream back to the UI through `toUIMessageStreamResponse`.

### Boundaries and conventions

- App-internal logic uses **`createServerFn`** (typed RPC). Public/streaming endpoints use **server routes** under `src/routes/api/`.
- Secrets (`LOVABLE_API_KEY`, connector keys) are read inside handlers only — never at module scope, never in client bundles.
- Styling stays in semantic tokens (`src/styles.css`); no hardcoded colors in components.

## Project Structure

```text
src/
├── components/          # Reusable UI components (shadcn + custom)
│   ├── layout/          # AppShell, PageHeader, etc.
│   └── ui/              # shadcn/ui primitives
├── hooks/               # Custom React hooks
├── integrations/        # Supabase client + auth, Lovable helpers
├── lib/                 # Utilities, mock data, server helpers
│   ├── mock/            # engineering-data.ts (mock org data)
│   └── ai-gateway.server.ts
├── routes/              # TanStack Start file-based routes
│   ├── __root.tsx       # App shell (head/body/providers)
│   ├── auth.tsx         # Sign in / sign up
│   ├── reset-password.tsx
│   ├── _authenticated/  # All authenticated app pages
│   └── api/chat.ts      # AI Manager streaming endpoint
├── styles.css           # Tailwind v4 theme tokens
├── router.tsx           # Router configuration
└── start.ts             # TanStack Start entry config
```

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) >= 1.1
- Node.js >= 20 (for tooling compatibility)
- A Lovable Cloud project with Supabase auth configured

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_ORG/enginuity-ai.git
cd enginuity-ai

# 2. Install dependencies
bun install

# 3. Start the dev server
bun dev
```

Open [http://localhost:8080](http://localhost:8080) in your browser.

### Build for Production

```bash
bun run build
```

Preview the production build locally:

```bash
bun run preview
```

## Available Scripts

| Script              | Description                        |
| ------------------- | ---------------------------------- |
| `bun dev`           | Start the Vite dev server          |
| `bun run build`     | Production build                   |
| `bun run build:dev` | Development mode build             |
| `bun run preview`   | Preview the production build       |
| `bun run lint`      | Run ESLint                         |
| `bun run typecheck` | Run TypeScript type check          |
| `bun run test`      | Run Bun tests                      |
| `bun run format`    | Format code with Prettier          |
| `bun run format:check` | Check formatting with Prettier    |

## CI / GitHub Actions

The repository includes `.github/workflows/ci.yml`, which runs on every push and pull request to `main`:

1. **Install dependencies** with `bun install --frozen-lockfile`.
2. **Lint** with `bun run lint`.
3. **Check formatting** with `bun run format:check`.
4. **Type-check** with `bun run typecheck`.
5. **Run tests** with `bun test`.

Pull requests that fail any of these checks cannot be merged cleanly.

## Environment Variables

The project relies on Lovable Cloud for auth and backend. Required variables are injected automatically when running inside Lovable. For local development, ensure these are present in `.env`:

```env
# Supabase (Lovable Cloud)
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=

# Lovable AI Gateway
LOVABLE_API_KEY=

# Optional: live connectors (used by /api/chat tools)
LINEAR_API_KEY=
NOTION_API_KEY=
```

> **Important:** Service-role keys and database passwords are managed by Lovable Cloud and are not exposed. Do not commit `.env` or secrets to version control.

## AI Manager & MCP Tools

The AI Manager (`/ai-manager`) streams through `/api/chat` using the Vercel AI SDK and Lovable AI Gateway. It exposes tools for live connectors:

- **Linear:**
  - `linear_list_teams` — list workspace teams
  - `linear_list_issues` — filter issues by assignee, team, state, etc.
  - `linear_create_issue` — create a new issue
- **Notion:**
  - `notion_search` — search pages and databases
  - `notion_get_page` — fetch page metadata/properties
  - `notion_get_page_content` — extract plain-text/markdown content from page blocks

When a user asks about planning, specs, PRDs, runbooks, or documentation quality, the system prompt instructs the AI to search Notion first, fetch relevant pages, summarize them, and flag missing sections (e.g., no acceptance criteria, no rollout plan, stale > 90 days).

## Authentication

- Email/password and Google OAuth sign-in via Lovable Cloud (Supabase Auth).
- Authenticated routes live under `_authenticated/` and are protected by the `_authenticated/route.tsx` gate.
- Public routes: `/auth`, `/reset-password`.

## Design System

- **Primary palette:** emerald `#10b981`, amber `#f59e0b`, zinc surfaces
- **Typography:** Inter Display headings + JetBrains Mono for data/mono labels
- **Dark-first theme:** semantic CSS tokens in `src/styles.css`
- **Animations:** smooth fade-up entrance transitions
- **Navigation:** collapsible sidebar with persisted state; global ⌘K command palette for keyboard-driven navigation
- **Responsive:** sidebar collapses on smaller viewports; chart labels and tooltips use high-contrast emerald text

## Deployment

This project is built for the Lovable Cloud / edge runtime. Deployments are handled through the Lovable platform. When connected to GitHub, changes sync bidirectionally:

1. Push to your GitHub repository.
2. Lovable pulls the changes and updates the live preview.
3. Publish from Lovable to make the app live.

For self-hosting, the codebase uses standard open-source packages and can be deployed anywhere that supports Vite + Node-compatible serverless runtimes. You will need to provide the environment variables listed above in your hosting provider.

## Roadmap / Out of Scope

Currently implemented in V1:

- Full UI with mocked engineering data
- Auth + route protection
- Streaming AI chat
- Linear & Notion tool calling (when keys are configured)

Not yet implemented:

- Real Jira/Slack API integrations (UI present, backend pending)
- Database-backed multi-tenant organizations
- PDF export / email delivery for reports

## Contributing

This is a Lovable-managed project. For significant changes, open an issue or pull request on GitHub. Keep contributions aligned with the existing TanStack Start conventions, shadcn/ui component patterns, and semantic design tokens.

## License

[MIT](LICENSE) — © Enginuity AI

---

Built with ❤️ using Lovable + TanStack Start.
