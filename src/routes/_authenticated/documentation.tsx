import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { docs } from "@/lib/mock/engineering-data";

export const Route = createFileRoute("/_authenticated/documentation")({
  head: () => ({ meta: [{ title: "Documentation — Enginuity" }] }),
  component: DocsPage,
});

function DocsPage() {
  return (
    <div className="p-6 space-y-4">
      <PageHeader
        title="Documentation Intelligence"
        subtitle="AI-graded health and missing sections across all sources."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {docs.map((d) => (
          <Card key={d.id} className="p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display font-semibold">{d.title}</div>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-1">
                  {d.source} · {d.updated}
                </div>
              </div>
              <div className="text-2xl font-display font-bold text-primary">{d.health}</div>
            </div>
            {d.missing.length > 0 ? (
              <div className="pt-2 border-t border-border">
                <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
                  Missing
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {d.missing.map((m) => (
                    <Badge
                      key={m}
                      variant="outline"
                      className="bg-amber-500/10 text-amber-400 border-amber-500/30"
                    >
                      {m}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-xs text-primary font-mono pt-2 border-t border-border">
                ✓ Complete
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
