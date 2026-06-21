import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { pullRequests } from "@/lib/mock/engineering-data";

export const Route = createFileRoute("/_authenticated/pull-requests")({
  head: () => ({ meta: [{ title: "Pull Requests — Enginuity" }] }),
  component: PRPage,
});

const statusTone: Record<string, string> = {
  open: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  review: "bg-amber-500/15 text-amber-400 border-amber-500/30",
  ready: "bg-primary/15 text-primary border-primary/30",
  merged: "bg-violet-500/15 text-violet-400 border-violet-500/30",
  blocked: "bg-red-500/15 text-red-400 border-red-500/30",
};

function PRPage() {
  return (
    <div className="p-6 space-y-4">
      <PageHeader
        title="Pull Request Insights"
        subtitle="AI-augmented review across 8 repositories."
      />
      {pullRequests.map((pr) => (
        <Card key={pr.id} className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground mb-1">
                <span>#{pr.id}</span>
                <span>·</span>
                <span>{pr.repo}</span>
                <span>·</span>
                <span>{pr.author}</span>
              </div>
              <div className="font-display font-medium">{pr.title}</div>
              <p className="text-sm text-muted-foreground mt-2">{pr.summary}</p>
              <div className="flex gap-4 text-xs font-mono text-muted-foreground mt-3">
                <span>{pr.files} files</span>
                <span className="text-primary">+{pr.additions}</span>
                <span className="text-red-400">-{pr.deletions}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className={statusTone[pr.status]}>
                {pr.status}
              </Badge>
              <div className="text-xs font-mono text-muted-foreground">
                Risk <span className="text-foreground">{pr.risk}</span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
