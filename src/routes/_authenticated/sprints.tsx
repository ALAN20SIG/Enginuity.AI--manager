import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { burndown, sprint, insights } from "@/lib/mock/engineering-data";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export const Route = createFileRoute("/_authenticated/sprints")({
  head: () => ({ meta: [{ title: "Sprints — Enginuity" }] }),
  component: SprintsPage,
});

function SprintsPage() {
  const pct = Math.round((sprint.completedPoints / sprint.totalPoints) * 100);
  return (
    <div className="p-6 space-y-6">
      <PageHeader title={`Sprint ${sprint.number} · ${sprint.name}`} subtitle={sprint.goal} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div className="font-display font-semibold">Burndown</div>
            <div className="text-xs font-mono text-muted-foreground">
              {sprint.daysRemaining} days remaining
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={burndown}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="day"
                  stroke="#000000"
                  fontSize={11}
                  tick={{ fill: "#000000" }}
                  label={{
                    value: "Day",
                    position: "insideBottom",
                    offset: -2,
                    fill: "#000000",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  stroke="#000000"
                  fontSize={11}
                  tick={{ fill: "#000000" }}
                  label={{
                    value: "Points Remaining",
                    angle: -90,
                    position: "insideLeft",
                    fill: "#000000",
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                    color: "#000000",
                    fontSize: 12,
                    padding: "8px 12px",
                    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
                  }}
                  itemStyle={{ color: "#000000" }}
                  labelStyle={{ color: "#000000", marginBottom: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="ideal"
                  stroke="hsl(var(--muted-foreground))"
                  strokeDasharray="4 4"
                  dot={false}
                />
                <Line type="monotone" dataKey="remaining" stroke="var(--chart-2)" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 space-y-4">
          <div className="font-display font-semibold">Progress</div>
          <div>
            <div className="text-3xl font-display font-bold">{pct}%</div>
            <div className="text-xs text-muted-foreground font-mono mt-1">
              {sprint.completedPoints} / {sprint.totalPoints} pts
            </div>
          </div>
          <Progress value={pct} className="h-2" />
          <div className="pt-3 border-t border-border space-y-2">
            {insights.slice(0, 3).map((i, idx) => (
              <div key={idx} className="text-xs">
                <div className="font-medium">{i.title}</div>
                <div className="text-muted-foreground mt-0.5">{i.body}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {(["todo", "progress", "review", "done"] as const).map((col) => (
          <Card key={col} className="p-4 space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-2">
              {col}
            </div>
            {sprint.columns[col].map((t) => (
              <div
                key={t.id}
                className="p-3 rounded border border-border bg-secondary/30 text-xs space-y-1"
              >
                <div className="font-mono text-[10px] text-muted-foreground">
                  {t.id} · {t.points}pt
                </div>
                <div className="text-foreground">{t.title}</div>
                <div className="font-mono text-[10px] text-muted-foreground">
                  {t.assignee} · {t.priority}
                </div>
              </div>
            ))}
          </Card>
        ))}
      </div>
    </div>
  );
}
