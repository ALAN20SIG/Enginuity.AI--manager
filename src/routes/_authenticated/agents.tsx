import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { agents } from "@/lib/mock/engineering-data";
import { Cpu } from "lucide-react";

export const Route = createFileRoute("/_authenticated/agents")({
  head: () => ({ meta: [{ title: "AI Agents — Enginuity" }] }),
  component: AgentsPage,
});

const statusTone: Record<string, string> = {
  active: "bg-primary/15 text-primary border-primary/30",
  degraded: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  offline: "bg-muted text-muted-foreground border-border",
};

function AgentsPage() {
  return (
    <div className="p-6 space-y-4">
      <PageHeader
        title="AI Agents"
        subtitle="Specialized autonomous agents collaborating across the org."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {agents.map((a) => (
          <Card key={a.id} className="p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded bg-primary/15 text-primary flex items-center justify-center">
                  <Cpu className="size-5" />
                </div>
                <div>
                  <div className="font-display font-semibold">{a.name}</div>
                  <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-0.5">
                    {a.tasks.toLocaleString()} tasks
                  </div>
                </div>
              </div>
              <Badge variant="outline" className={statusTone[a.status]}>
                {a.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{a.responsibility}</p>
            <div className="flex justify-between text-xs font-mono pt-2 border-t border-border">
              <span className="text-muted-foreground">Accuracy</span>
              <span className="text-primary">{a.accuracy}%</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
