import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { notifications } from "@/lib/mock/engineering-data";
import { AlertTriangle, Info, Sparkles } from "lucide-react";

export const Route = createFileRoute("/_authenticated/notifications")({
  head: () => ({ meta: [{ title: "Notifications — Enginuity" }] }),
  component: NotificationsPage,
});

const iconFor = { risk: AlertTriangle, info: Info, wins: Sparkles } as const;
const toneFor = {
  risk: "text-red-400 bg-red-500/10",
  info: "text-blue-400 bg-blue-500/10",
  wins: "text-primary bg-primary/10",
} as const;

function NotificationsPage() {
  return (
    <div className="p-6 space-y-3 max-w-3xl">
      <PageHeader title="Notifications" subtitle="Unified feed across all MCP nodes and agents." />
      {notifications.map((n) => {
        const Icon = iconFor[n.kind];
        return (
          <Card key={n.id} className="p-4 flex items-start gap-3">
            <div
              className={`size-9 rounded flex items-center justify-center shrink-0 ${toneFor[n.kind]}`}
            >
              <Icon className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm">{n.title}</div>
              <div className="text-xs font-mono text-muted-foreground mt-1">{n.time}</div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
