import { type ReactNode } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  LayoutDashboard, Bot, FolderKanban, Activity, Users, GitPullRequest,
  ShieldAlert, FileText, BarChart3, Plug, Cpu, Settings, Search, Bell, Sparkles, LogOut,
} from "lucide-react";
import logo from "@/assets/enginuity-logo.png";
import { supabase } from "@/integrations/supabase/client";

const NAV = [
  { section: "Main Console", items: [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/ai-manager", label: "AI Manager", icon: Bot },
    { to: "/projects", label: "Projects", icon: FolderKanban },
    { to: "/sprints", label: "Sprints", icon: Activity },
  ]},
  { section: "Intelligence", items: [
    { to: "/team-analytics", label: "Team Analytics", icon: Users },
    { to: "/pull-requests", label: "PR Insights", icon: GitPullRequest },
    { to: "/risks", label: "Risk Radar", icon: ShieldAlert },
    { to: "/documentation", label: "Documentation", icon: FileText },
    { to: "/reports", label: "Reports", icon: BarChart3 },
    { to: "/agents", label: "AI Agents", icon: Cpu },
  ]},
  { section: "Config", items: [
    { to: "/mcp-connections", label: "MCP Nodes", icon: Plug },
    { to: "/settings", label: "Settings", icon: Settings },
  ]},
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const navigate = useNavigate();

  async function signOut() {
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      <nav className="w-60 border-r border-border flex flex-col shrink-0">
        <div className="p-4 mb-2 flex items-center gap-2">
          <img src={logo} alt="Enginuity" width={24} height={24} className="rounded" />
          <span className="font-display font-bold tracking-tight text-base">ENGINUITY</span>
        </div>
        <div className="flex-1 px-3 space-y-1 text-sm overflow-y-auto">
          {NAV.map((group) => (
            <div key={group.section}>
              <div className="text-[10px] font-mono text-muted-foreground px-2 py-2 mt-2 uppercase tracking-widest">
                {group.section}
              </div>
              {group.items.map((item) => {
                const active = pathname === item.to || (item.to !== "/" && pathname.startsWith(item.to));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`flex items-center gap-3 px-2 py-1.5 rounded transition-colors ${active ? "bg-white/5 text-foreground font-medium" : "text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"}`}
                  >
                    <Icon className="size-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
        <div className="p-3 border-t border-border flex items-center gap-3">
          <div className="size-8 bg-secondary rounded-full flex items-center justify-center font-mono text-xs">MC</div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-medium truncate">Marcus Chen</div>
            <div className="text-[10px] text-muted-foreground truncate">Engineering Lead</div>
          </div>
          <button onClick={signOut} className="text-muted-foreground hover:text-foreground" title="Sign out">
            <LogOut className="size-4" />
          </button>
        </div>
      </nav>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-14 border-b border-border flex items-center justify-between px-6 bg-background/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96 max-w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
              <input
                placeholder="Search commands, repos, PRs…"
                className="w-full bg-secondary border border-border rounded-md py-1.5 pl-9 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
              <kbd className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] font-mono text-muted-foreground border border-border rounded px-1.5 py-0.5">/</kbd>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5 font-mono text-[10px] text-primary">
              <span className="size-1.5 bg-primary rounded-full animate-pulse" />
              SYSTEMS OPTIMAL
            </div>
            <button className="text-muted-foreground hover:text-foreground" title="Team">
              <span className="text-xs font-mono uppercase tracking-widest">Acme · Eng</span>
            </button>
            <Link to="/ai-manager" className="text-muted-foreground hover:text-primary" title="AI Assistant">
              <Sparkles className="size-4" />
            </Link>
            <Link to="/notifications" className="text-muted-foreground hover:text-foreground relative" title="Notifications">
              <Bell className="size-4" />
              <span className="absolute -top-0.5 -right-0.5 size-1.5 bg-accent rounded-full" />
            </Link>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}