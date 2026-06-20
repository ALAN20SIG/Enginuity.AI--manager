import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { projects } from "@/lib/mock/engineering-data";

export const Route = createFileRoute("/_authenticated/projects")({
  head: () => ({ meta: [{ title: "Projects — Enginuity" }] }),
  component: ProjectsPage,
});

const riskTone = {
  low: "bg-primary/15 text-primary border-primary/30",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  high: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  critical: "bg-red-500/15 text-red-400 border-red-500/30",
} as const;

function ProjectsPage() {
  return (
    <div className="p-6">
      <PageHeader title="Projects" subtitle="Active engineering initiatives across pods." />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {projects.map((p) => (
          <Card key={p.id} className="p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display font-semibold">{p.name}</div>
                <div className="text-xs text-muted-foreground font-mono uppercase tracking-widest mt-1">{p.team}</div>
              </div>
              <Badge variant="outline" className={riskTone[p.risk]}>{p.risk}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{p.description}</p>
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-muted-foreground">PROGRESS</span>
                <span>{p.progress}%</span>
              </div>
              <Progress value={p.progress} className="h-1.5" />
            </div>
            <div className="flex justify-between text-xs font-mono pt-2 border-t border-border">
              <span className="text-muted-foreground">Health <span className="text-foreground">{p.health}</span></span>
              <span className="text-muted-foreground">Due <span className="text-foreground">{p.deadline}</span></span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}