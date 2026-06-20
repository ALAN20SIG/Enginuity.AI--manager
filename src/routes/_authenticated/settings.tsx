import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({ meta: [{ title: "Settings — Enginuity" }] }),
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="p-6 space-y-6 max-w-3xl">
      <PageHeader title="Settings" subtitle="Workspace, AI provider, and integration preferences." />

      <Card className="p-5 space-y-4">
        <div className="font-display font-semibold">Workspace</div>
        <div className="space-y-2">
          <Label>Organization name</Label>
          <Input defaultValue="Acme Engineering" />
        </div>
        <div className="space-y-2">
          <Label>Default team</Label>
          <Input defaultValue="Platform" />
        </div>
      </Card>

      <Card className="p-5 space-y-4">
        <div className="font-display font-semibold">AI Provider</div>
        <div className="space-y-2">
          <Label>Default model</Label>
          <Input defaultValue="google/gemini-3-flash-preview" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Enable proactive insights</div>
            <div className="text-xs text-muted-foreground">Agents will surface risk cards without prompting.</div>
          </div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-medium">Auto-summarize PRs</div>
            <div className="text-xs text-muted-foreground">New PRs get an AI summary within 60 seconds.</div>
          </div>
          <Switch defaultChecked />
        </div>
      </Card>

      <div className="flex justify-end">
        <Button>Save changes</Button>
      </div>
    </div>
  );
}