// Realistic mock engineering data for Enginuity AI.

export type RiskLevel = "low" | "medium" | "high" | "critical";
export type PRStatus = "open" | "review" | "ready" | "merged" | "blocked";

export const kpis = {
  sprintCompletion: { value: 78, delta: +6, label: "Sprint Completion" },
  openPRs: { value: 142, delta: +12, label: "Active PRs" },
  blockers: { value: 8, delta: -2, label: "Open Risks" },
  velocity: { value: 184, delta: +18, label: "Velocity (pts)" },
  health: { value: 92, delta: +4, label: "Engineering Health" },
  deploySuccess: { value: 98.4, delta: +0.6, label: "Deploy Success" },
  cycleTime: { value: 3.2, delta: -0.4, label: "Cycle Time (d)" },
  mttr: { value: "2.4h", delta: "-12m", label: "MTTR" },
};

export const healthBreakdown = [
  { name: "Code Quality", score: 88 },
  { name: "Sprint Health", score: 94 },
  { name: "Documentation", score: 76 },
  { name: "Delivery Speed", score: 95 },
  { name: "Technical Debt", score: 82 },
];

export const velocityTrend = [
  { sprint: "S19", points: 140, ideal: 150 },
  { sprint: "S20", points: 155, ideal: 160 },
  { sprint: "S21", points: 162, ideal: 165 },
  { sprint: "S22", points: 158, ideal: 170 },
  { sprint: "S23", points: 175, ideal: 175 },
  { sprint: "S24", points: 184, ideal: 180 },
  { sprint: "S25", points: 168, ideal: 185 },
];

export const burndown = [
  { day: "D1", remaining: 120, ideal: 120 },
  { day: "D2", remaining: 116, ideal: 108 },
  { day: "D3", remaining: 108, ideal: 96 },
  { day: "D4", remaining: 92, ideal: 84 },
  { day: "D5", remaining: 78, ideal: 72 },
  { day: "D6", remaining: 64, ideal: 60 },
  { day: "D7", remaining: 52, ideal: 48 },
  { day: "D8", remaining: 40, ideal: 36 },
  { day: "D9", remaining: 32, ideal: 24 },
  { day: "D10", remaining: 28, ideal: 12 },
];

export const sprint = {
  name: "Alpha Phoenix",
  number: 25,
  goal: "Ship MCP-orchestrated PR review pipeline + multi-tenant org switching.",
  daysRemaining: 4,
  totalPoints: 120,
  completedPoints: 84,
  columns: {
    todo: [
      { id: "ENG-442", title: "Integrate MCP Context for Linear sync", points: 5, priority: "high", assignee: "MC" },
      { id: "ENG-451", title: "Add audit log for agent activity", points: 3, priority: "medium", assignee: "RP" },
      { id: "ENG-455", title: "Wire deploy-freq KPI to Vercel API", points: 2, priority: "low", assignee: "JL" },
    ],
    progress: [
      { id: "ENG-439", title: "Multi-agent PR Review orchestration", points: 8, priority: "high", assignee: "MC" },
      { id: "ENG-440", title: "Refactor auth middleware for MCP nodes", points: 5, priority: "medium", assignee: "AN" },
      { id: "ENG-446", title: "Sprint risk scoring v2", points: 5, priority: "high", assignee: "RP" },
    ],
    review: [
      { id: "ENG-432", title: "Notion docs intelligence summarizer", points: 5, priority: "medium", assignee: "JL" },
      { id: "ENG-435", title: "GitHub webhook signature verification", points: 3, priority: "high", assignee: "AN" },
    ],
    done: [
      { id: "ENG-412", title: "Core schema update for orgs", points: 8, priority: "high", assignee: "MC" },
      { id: "ENG-418", title: "Engineering health composite score", points: 5, priority: "medium", assignee: "RP" },
      { id: "ENG-422", title: "Burndown chart component", points: 3, priority: "low", assignee: "JL" },
    ],
  },
};

export const team = [
  { id: "mc", initials: "MC", name: "Marcus Chen", role: "Staff Engineer",   tasks: 14, reviews: 22, velocity: 38, risk: "low" as RiskLevel },
  { id: "rp", initials: "RP", name: "Riya Patel",   role: "Senior Engineer", tasks: 11, reviews: 18, velocity: 32, risk: "low" as RiskLevel },
  { id: "jl", initials: "JL", name: "Jamie Lin",    role: "Engineer",         tasks: 9,  reviews: 12, velocity: 24, risk: "medium" as RiskLevel },
  { id: "an", initials: "AN", name: "Ada Nakamura", role: "Senior Engineer", tasks: 12, reviews: 20, velocity: 34, risk: "low" as RiskLevel },
  { id: "bo", initials: "BO", name: "Ben Okafor",   role: "Engineer",         tasks: 8,  reviews: 9,  velocity: 22, risk: "high" as RiskLevel },
  { id: "sd", initials: "SD", name: "Sofia Diaz",   role: "Tech Lead",        tasks: 10, reviews: 26, velocity: 30, risk: "low" as RiskLevel },
];

export const projects = [
  { id: "phoenix", name: "Project Phoenix", team: "Platform", progress: 72, risk: "low" as RiskLevel,    deadline: "Apr 18", health: 94, description: "MCP orchestration engine and agent runtime." },
  { id: "atlas",   name: "Atlas Billing",   team: "Payments", progress: 48, risk: "medium" as RiskLevel, deadline: "May 02", health: 78, description: "Stripe-backed metered billing for orgs." },
  { id: "nova",    name: "Nova Mobile",     team: "Mobile",   progress: 31, risk: "high" as RiskLevel,   deadline: "May 28", health: 62, description: "React Native client + offline-first sync." },
  { id: "helios",  name: "Project Helios",  team: "Data",     progress: 86, risk: "low" as RiskLevel,    deadline: "Apr 09", health: 91, description: "Real-time engineering analytics warehouse." },
  { id: "orion",   name: "Orion Auth",      team: "Security", progress: 64, risk: "medium" as RiskLevel, deadline: "Apr 24", health: 83, description: "SAML SSO and SCIM provisioning rollout." },
  { id: "kepler",  name: "Kepler Search",   team: "Search",   progress: 22, risk: "critical" as RiskLevel, deadline: "Jun 11", health: 54, description: "Vector + lexical hybrid search for docs." },
];

export const pullRequests = [
  { id: 842, title: "feat(auth): rotate session keys on org switch", repo: "enginuity/api", author: "MC", files: 14, additions: 312, deletions: 88, status: "review" as PRStatus, risk: 72, summary: "Touches the session middleware. AI flagged missing test coverage for the new key-rotation branch." },
  { id: 838, title: "feat(mcp): add Linear MCP server adapter",       repo: "enginuity/mcp", author: "AN", files: 9,  additions: 540, deletions: 12, status: "ready" as PRStatus,  risk: 21, summary: "All checks green. Ready to merge — confidence high." },
  { id: 835, title: "fix(sprint): correct burndown ideal line",        repo: "enginuity/web", author: "JL", files: 2,  additions: 14,  deletions: 6,  status: "open" as PRStatus,   risk: 8,  summary: "Trivial chart fix. Suggest auto-merge after a self-review." },
  { id: 833, title: "feat(agents): code-review agent v2",              repo: "enginuity/agents", author: "RP", files: 21, additions: 1280, deletions: 410, status: "review" as PRStatus, risk: 88, summary: "Potential security issue around prompt injection in tool output. Recommend an additional reviewer from the Security pod." },
  { id: 829, title: "chore(deps): bump @ai-sdk to 6.0",                repo: "enginuity/api", author: "SD", files: 1,  additions: 1,   deletions: 1,  status: "ready" as PRStatus,  risk: 15, summary: "Minor patch bump. No breaking changes detected." },
  { id: 824, title: "feat(reports): weekly exec PDF export",           repo: "enginuity/web", author: "BO", files: 11, additions: 420, deletions: 0,  status: "blocked" as PRStatus, risk: 64, summary: "Blocked on infrastructure team's headless-chrome runner." },
];

export const risks = [
  { id: "r1", title: "Database migration window",        category: "Delivery",     severity: "high" as RiskLevel,     probability: 82, owner: "Platform", note: "Required downtime conflicts with EU business hours; needs a green/blue strategy." },
  { id: "r2", title: "Code-review agent prompt injection", category: "Security",   severity: "critical" as RiskLevel, probability: 64, owner: "Security", note: "PR #833 introduces a new tool surface that can be coerced by hostile diff content." },
  { id: "r3", title: "Mobile pod under-resourced",         category: "Resource",   severity: "high" as RiskLevel,     probability: 71, owner: "Mobile",   note: "Nova milestone slip projected at 9 days at current velocity." },
  { id: "r4", title: "Notion sync rate limits",            category: "Technical Debt", severity: "medium" as RiskLevel, probability: 55, owner: "Data",   note: "Polling pattern will hit limits at 3x current workspaces." },
  { id: "r5", title: "AuthN dependency on third-party",    category: "Delivery",     severity: "medium" as RiskLevel,   probability: 40, owner: "Security", note: "SAML rollout depends on partner IDP test environment." },
];

export const insights = [
  { kind: "risk" as const,  title: "Risk Detected",            body: "Sprint velocity slowing in 'Infrastructure' pod. Potential blockage in AWS IAM rollout." },
  { kind: "wins" as const,  title: "Optimization Opportunity", body: "Multi-agent PR review reduced cycle time by 18% in the last 72 hours. Recommend rolling out to the mobile team." },
  { kind: "info" as const,  title: "MCP Integration Status",   body: "Jira + GitHub sync completed. Context window for Agent-01 expanded to 128k tokens." },
  { kind: "risk" as const,  title: "Stale PR Warning",         body: "3 pull requests have not been reviewed for over 5 days. PR #824 is blocking the weekly exec report rollout." },
];

export const integrations = [
  { id: "github",   name: "GitHub",      status: "connected" as const,    lastSync: "2 min ago",  scopes: ["repo", "read:org", "workflow"] },
  { id: "jira",     name: "Jira",        status: "connected" as const,    lastSync: "8 min ago",  scopes: ["read:project", "write:issue"] },
  { id: "slack",    name: "Slack",       status: "connected" as const,    lastSync: "1 min ago",  scopes: ["chat:write", "channels:read"] },
  { id: "notion",   name: "Notion",      status: "syncing" as const,      lastSync: "syncing…",   scopes: ["read:content"] },
  { id: "postgres", name: "PostgreSQL",  status: "connected" as const,    lastSync: "4 min ago",  scopes: ["read"] },
  { id: "linear",   name: "Linear",      status: "disconnected" as const, lastSync: "—",          scopes: [] },
  { id: "gdrive",   name: "Google Drive",status: "error" as const,        lastSync: "Failed 12m", scopes: ["read:files"] },
];

export const agents = [
  { id: "em",       name: "Engineering Manager Agent", status: "active" as const,    accuracy: 96.4, tasks: 1284, responsibility: "Sprint analysis, team monitoring, executive reporting.", color: "primary" as const },
  { id: "pm",       name: "Product Manager Agent",     status: "active" as const,    accuracy: 92.1, tasks: 642,  responsibility: "Roadmaps, requirements grooming, prioritization.",       color: "accent" as const },
  { id: "review",   name: "Code Review Agent",         status: "active" as const,    accuracy: 89.7, tasks: 3120, responsibility: "PR analysis, security review, quality checks.",         color: "primary" as const },
  { id: "devops",   name: "DevOps Agent",              status: "degraded" as const,  accuracy: 84.3, tasks: 980,  responsibility: "Deployments, infrastructure monitoring, reliability.", color: "accent" as const },
];

export const docs = [
  { id: "arch",  source: "Notion",  title: "Platform Architecture v4",    updated: "2d ago",  health: 88, missing: ["Disaster Recovery", "SLO definitions"] },
  { id: "mcp",   source: "Notion",  title: "MCP Integration Playbook",    updated: "1d ago",  health: 94, missing: [] },
  { id: "rls",   source: "GDrive",  title: "Security & RLS Policy",       updated: "5d ago",  health: 72, missing: ["Audit log retention"] },
  { id: "api",   source: "GitHub",  title: "API Reference (generated)",   updated: "3h ago",  health: 96, missing: [] },
  { id: "onbo",  source: "Notion",  title: "Engineer Onboarding",         updated: "12d ago", health: 58, missing: ["MCP local dev", "Agent tracing", "Incident response"] },
];

export const notifications = [
  { id: 1, kind: "risk" as const,  title: "Critical risk: PR #833 security review needed", time: "2m ago" },
  { id: 2, kind: "info" as const,  title: "Sprint Alpha Phoenix is 70% complete",          time: "1h ago" },
  { id: 3, kind: "wins" as const,  title: "Cycle time decreased by 14% week-over-week",    time: "3h ago" },
  { id: 4, kind: "risk" as const,  title: "PR #824 blocked for 4 days",                    time: "5h ago" },
  { id: 5, kind: "info" as const,  title: "MCP Notion sync completed successfully",        time: "8h ago" },
];

export const suggestedPrompts = [
  "What's blocking the backend team this sprint?",
  "Generate the weekly engineering report.",
  "Which open pull requests need urgent attention?",
  "Analyze the current sprint's health and risk.",
  "Predict project delays for the next two weeks.",
  "Draft tasks for a new SSO feature.",
];

export const reportTemplates = [
  { id: "weekly",  name: "Weekly Engineering Report", description: "KPIs, completed work, risks, and AI commentary for last week.", frequency: "Every Monday 09:00" },
  { id: "sprint",  name: "Sprint Retrospective",      description: "Goal attainment, velocity, blockers, and follow-ups for the latest sprint.", frequency: "End of sprint" },
  { id: "exec",    name: "Executive Summary",         description: "C-level view of org health, delivery, and risk posture.", frequency: "Monthly" },
  { id: "team",    name: "Team Performance Report",   description: "Per-engineer contribution, review load, and velocity.", frequency: "Bi-weekly" },
];