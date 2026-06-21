import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { risks } from "@/lib/mock/engineering-data";

export const Route = createFileRoute("/_authenticated/risks")({
  head: () => ({ meta: [{ title: "Risk Radar — Enginuity" }] }),
  component: RisksPage,
});

const tone: Record<string, string> = {
  low: "bg-primary/15 text-primary border-primary/30",
  medium: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  high: "bg-orange-500/15 text-orange-400 border-orange-500/30",
  critical: "bg-red-500/15 text-red-400 border-red-500/30",
};

function RisksPage() {
  return (
    <div className="p-6 space-y-4">
      <PageHeader
        title="Risk Radar"
        subtitle="AI-predicted risks across delivery, security, and resourcing."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {risks.map((r) => (
          <Card key={r.id} className="p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display font-semibold">{r.title}</div>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-1">
                  {r.category} · {r.owner}
                </div>
              </div>
              <Badge variant="outline" className={tone[r.severity]}>
                {r.severity}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{r.note}</p>
            <div className="flex justify-between text-xs font-mono pt-2 border-t border-border">
              <span className="text-muted-foreground">Probability</span>
              <span>{r.probability}%</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
