import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { integrations } from "@/lib/mock/engineering-data";
import { Plug } from "lucide-react";

export const Route = createFileRoute("/_authenticated/mcp-connections")({
  head: () => ({ meta: [{ title: "MCP Connections — Enginuity" }] }),
  component: MCPPage,
});

const statusTone: Record<string, string> = {
  connected: "bg-primary/15 text-primary border-primary/30",
  syncing: "bg-blue-500/15 text-blue-400 border-blue-500/30",
  disconnected: "bg-muted text-muted-foreground border-border",
  error: "bg-red-500/15 text-red-400 border-red-500/30",
};

function MCPPage() {
  return (
    <div className="p-6 space-y-4">
      <PageHeader title="MCP Connections" subtitle="Model Context Protocol nodes feeding the engineering brain." />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {integrations.map((i) => (
          <Card key={i.id} className="p-5 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded bg-secondary flex items-center justify-center">
                  <Plug className="size-5" />
                </div>
                <div>
                  <div className="font-display font-semibold">{i.name}</div>
                  <div className="text-xs font-mono text-muted-foreground mt-0.5">Last sync · {i.lastSync}</div>
                </div>
              </div>
              <Badge variant="outline" className={statusTone[i.status]}>{i.status}</Badge>
            </div>
            {i.scopes.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {i.scopes.map((s) => (
                  <span key={s} className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-border text-muted-foreground">{s}</span>
                ))}
              </div>
            )}
            <Button size="sm" variant="outline" className="w-full">
              {i.status === "connected" || i.status === "syncing" ? "Manage" : "Connect"}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}