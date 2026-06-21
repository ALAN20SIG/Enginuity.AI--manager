import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { reportTemplates } from "@/lib/mock/engineering-data";
import { FileText, Download } from "lucide-react";

export const Route = createFileRoute("/_authenticated/reports")({
  head: () => ({ meta: [{ title: "Reports — Enginuity" }] }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <div className="p-6 space-y-4">
      <PageHeader title="Reports" subtitle="AI-generated executive, sprint, and team reports." />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reportTemplates.map((r) => (
          <Card key={r.id} className="p-5 space-y-3">
            <div className="flex items-start gap-3">
              <div className="size-10 rounded bg-primary/15 text-primary flex items-center justify-center">
                <FileText className="size-5" />
              </div>
              <div className="flex-1">
                <div className="font-display font-semibold">{r.name}</div>
                <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mt-1">
                  {r.frequency}
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">{r.description}</p>
            <div className="flex gap-2 pt-2 border-t border-border">
              <Button size="sm" variant="default">
                Generate
              </Button>
              <Button size="sm" variant="outline">
                <Download className="size-3.5 mr-1" /> Export
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
