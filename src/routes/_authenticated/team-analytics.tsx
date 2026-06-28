import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { team, velocityTrend } from "@/lib/mock/engineering-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/_authenticated/team-analytics")({
  head: () => ({ meta: [{ title: "Team Analytics — Enginuity" }] }),
  component: TeamAnalyticsPage,
});

function TeamAnalyticsPage() {
  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Team Analytics"
        subtitle="Productivity, review load, and individual velocity."
      />

      <Card className="p-5">
        <div className="font-display font-semibold mb-4">Velocity by Sprint</div>
        <div className="h-56">
          <ResponsiveContainer>
            <BarChart data={velocityTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="sprint"
                stroke="#10b981"
                fontSize={11}
                tick={{ fill: "#10b981" }}
                label={{
                  value: "Sprint",
                  position: "insideBottom",
                  offset: -2,
                  fill: "#10b981",
                  fontSize: 11,
                }}
              />
              <YAxis
                stroke="#10b981"
                fontSize={11}
                tick={{ fill: "#10b981" }}
                label={{
                  value: "Story Points",
                  angle: -90,
                  position: "insideLeft",
                  fill: "#10b981",
                  fontSize: 11,
                }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "var(--radius)",
                  color: "#10b981",
                  fontSize: 12,
                  padding: "8px 12px",
                  boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
                }}
                itemStyle={{ color: "#10b981" }}
                labelStyle={{ color: "#10b981", marginBottom: 4 }}
              />
              <Bar dataKey="points" fill="var(--chart-3)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/40 text-xs font-mono uppercase tracking-widest text-muted-foreground">
            <tr>
              <th className="text-left p-3">Engineer</th>
              <th className="text-left p-3">Role</th>
              <th className="text-right p-3">Tasks</th>
              <th className="text-right p-3">Reviews</th>
              <th className="text-right p-3">Velocity</th>
              <th className="text-right p-3">Risk</th>
            </tr>
          </thead>
          <tbody>
            {team.map((m) => (
              <tr key={m.id} className="border-t border-border">
                <td className="p-3 flex items-center gap-2">
                  <div className="size-7 rounded-full bg-secondary flex items-center justify-center font-mono text-[10px]">
                    {m.initials}
                  </div>
                  {m.name}
                </td>
                <td className="p-3 text-muted-foreground">{m.role}</td>
                <td className="p-3 text-right font-mono">{m.tasks}</td>
                <td className="p-3 text-right font-mono">{m.reviews}</td>
                <td className="p-3 text-right font-mono">{m.velocity}</td>
                <td className="p-3 text-right">
                  <Badge variant="outline">{m.risk}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
