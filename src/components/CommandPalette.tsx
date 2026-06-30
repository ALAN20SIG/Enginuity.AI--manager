import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  LayoutDashboard,
  Bot,
  FolderKanban,
  Activity,
  Users,
  GitPullRequest,
  ShieldAlert,
  FileText,
  BarChart3,
  Plug,
  Cpu,
  Settings,
  Bell,
  LogOut,
  Sparkles,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Cmd = {
  id: string;
  label: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
  to?: string;
  action?: () => void | Promise<void>;
  group: "Navigate" | "Intelligence" | "Config" | "Actions";
};

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const navigate = useNavigate();
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.key === "k" || e.key === "K") && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "/" && !open) {
        const t = e.target as HTMLElement | null;
        const tag = t?.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA" || t?.isContentEditable) return;
        e.preventDefault();
        onOpenChange(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onOpenChange]);

  const run = (fn: () => void | Promise<void>) => {
    onOpenChange(false);
    void fn();
  };

  const cmds: Cmd[] = [
    { id: "n-dash", label: "Go to Dashboard", icon: LayoutDashboard, to: "/", group: "Navigate" },
    { id: "n-ai", label: "Open AI Manager", icon: Bot, to: "/ai-manager", group: "Navigate" },
    { id: "n-proj", label: "Projects", icon: FolderKanban, to: "/projects", group: "Navigate" },
    { id: "n-spr", label: "Sprints", icon: Activity, to: "/sprints", group: "Navigate" },
    {
      id: "i-team",
      label: "Team Analytics",
      icon: Users,
      to: "/team-analytics",
      group: "Intelligence",
    },
    {
      id: "i-pr",
      label: "PR Insights",
      icon: GitPullRequest,
      to: "/pull-requests",
      group: "Intelligence",
    },
    { id: "i-risk", label: "Risk Radar", icon: ShieldAlert, to: "/risks", group: "Intelligence" },
    {
      id: "i-docs",
      label: "Documentation",
      icon: FileText,
      to: "/documentation",
      group: "Intelligence",
    },
    { id: "i-rep", label: "Reports", icon: BarChart3, to: "/reports", group: "Intelligence" },
    { id: "i-ag", label: "AI Agents", icon: Cpu, to: "/agents", group: "Intelligence" },
    { id: "c-mcp", label: "MCP Connections", icon: Plug, to: "/mcp-connections", group: "Config" },
    { id: "c-set", label: "Settings", icon: Settings, to: "/settings", group: "Config" },
    {
      id: "c-notif",
      label: "Notifications",
      icon: Bell,
      to: "/notifications",
      group: "Config",
    },
    {
      id: "a-ask",
      label: "Ask Enginuity AI…",
      hint: "Start a new chat",
      icon: Sparkles,
      to: "/ai-manager",
      group: "Actions",
    },
    {
      id: "a-signout",
      label: signingOut ? "Signing out…" : "Sign out",
      icon: LogOut,
      group: "Actions",
      action: async () => {
        setSigningOut(true);
        await supabase.auth.signOut();
        navigate({ to: "/auth", replace: true });
      },
    },
  ];

  const groups = ["Navigate", "Intelligence", "Config", "Actions"] as const;

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {groups.map((g, idx) => {
          const items = cmds.filter((c) => c.group === g);
          if (!items.length) return null;
          return (
            <div key={g}>
              {idx > 0 && <CommandSeparator />}
              <CommandGroup heading={g}>
                {items.map((c) => {
                  const Icon = c.icon;
                  return (
                    <CommandItem
                      key={c.id}
                      value={`${c.group} ${c.label}`}
                      onSelect={() =>
                        run(() => {
                          if (c.action) return c.action();
                          if (c.to) navigate({ to: c.to });
                        })
                      }
                    >
                      <Icon className="mr-2 size-4" />
                      <span>{c.label}</span>
                      {c.hint && (
                        <span className="ml-auto text-xs text-muted-foreground">{c.hint}</span>
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </div>
          );
        })}
      </CommandList>
    </CommandDialog>
  );
}
