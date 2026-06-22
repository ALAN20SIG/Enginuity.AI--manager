import { createFileRoute } from "@tanstack/react-router";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
  AreaChart,
  Area,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Send, Sparkles } from "lucide-react";
import {
  kpis,
  healthBreakdown,
  velocityTrend,
  sprint,
  insights,
} from "@/lib/mock/engineering-data";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({ meta: [{ title: "Dashboard — Enginuity AI" }] }),
  component: Dashboard,
});

function Dashboard() {
  const kpiCards = [
    { ...kpis.openPRs, key: "PRs" },
    { ...kpis.blockers, key: "Risks" },
    { ...kpis.cycleTime, key: "Cycle Time", suffix: "d" },
    { ...kpis.velocity, key: "Velocity", suffix: "pts" },
    { ...kpis.deploySuccess, key: "Deploy Success", suffix: "%" },
    { ...kpis.sprintCompletion, key: "Sprint", suffix: "%" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-12 gap-6">
        {/* Health Radial */}
        <div className="col-span-12 lg:col-span-4 bg-card ring-1 ring-border rounded-xl p-6 relative overflow-hidden animate-fade-up">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-40 pointer-events-none" />
          <div className="relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  Engineering Health
                </h3>
                <p className="text-sm text-foreground/80">Composite Org Score</p>
              </div>
              <div className="px-2 py-1 bg-primary/10 text-primary font-mono text-[10px] rounded">
                +{kpis.health.delta}%
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative size-32">
                <ResponsiveContainer width="100%" height="100%">
                  <RadialBarChart
                    innerRadius="75%"
                    outerRadius="100%"
                    data={[{ name: "score", value: kpis.health.value, fill: "var(--chart-1)" }]}
                    startAngle={90}
                    endAngle={-270}
                  >
                    <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                    <RadialBar
                      background={{ fill: "hsl(var(--muted))" }}
                      dataKey="value"
                      cornerRadius={8}
                    />
                  </RadialBarChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-display font-extrabold leading-none">
                    {kpis.health.value}
                  </span>
                  <span className="text-[10px] font-mono text-muted-foreground mt-1">/ 100</span>
                </div>
              </div>
              <div className="flex-1 space-y-2">
                {healthBreakdown.map((h) => (
                  <div key={h.name}>
                    <div className="flex justify-between text-[10px] font-mono">
                      <span className="text-muted-foreground">{h.name}</span>
                      <span className="text-foreground">{h.score}</span>
                    </div>
                    <div className="h-1 bg-secondary rounded-full overflow-hidden">
                      <div className="h-full bg-chart-1" style={{ width: `${h.score}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-border pt-4">
              <div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase">MTTR</div>
                <div className="text-base font-display font-bold">
                  {kpis.mttr.value}{" "}
                  <span className="text-xs text-primary font-normal">{kpis.mttr.delta}</span>
                </div>
              </div>
              <div>
                <div className="text-[10px] font-mono text-muted-foreground uppercase">
                  Deploy Freq
                </div>
                <div className="text-base font-display font-bold">
                  12/d <span className="text-xs text-primary font-normal">+4</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="col-span-12 lg:col-span-8 grid grid-cols-2 lg:grid-cols-3 gap-4">
          {kpiCards.map((k, i) => {
            const delta = typeof k.delta === "number" ? k.delta : 0;
            const positive = delta >= 0;
            return (
              <div
                key={k.key}
                className="bg-card ring-1 ring-border rounded-xl p-4 flex flex-col justify-between animate-fade-up hover:ring-primary/30 transition-all"
                style={{ animationDelay: `${40 + i * 40}ms` }}
              >
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                  {k.key}
                </div>
                <div className="flex items-end justify-between mt-2">
                  <span className="text-3xl font-display font-bold">
                    {k.value}
                    {"suffix" in k && k.suffix ? (
                      <span className="text-base text-muted-foreground ml-0.5">{k.suffix}</span>
                    ) : null}
                  </span>
                  <div
                    className={`flex items-center gap-1 text-[10px] font-mono ${positive ? "text-primary" : "text-destructive"}`}
                  >
                    {positive ? (
                      <ArrowUpRight className="size-3" />
                    ) : (
                      <ArrowDownRight className="size-3" />
                    )}
                    {Math.abs(delta)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="bg-card ring-1 ring-border rounded-xl overflow-hidden animate-fade-up">
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="font-display font-bold">Velocity Trend</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 bg-secondary border border-border rounded text-[10px] font-mono uppercase">
                  Weekly
                </button>
                <button className="px-3 py-1 hover:bg-secondary rounded text-[10px] font-mono uppercase text-muted-foreground">
                  Monthly
                </button>
              </div>
            </div>
            <div className="p-4 h-64">
              <ResponsiveContainer>
                <AreaChart data={velocityTrend}>
                  <defs>
                    <linearGradient id="v" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="hsl(var(--border)/0.4)" />
                  <XAxis
                    dataKey="sprint"
                    stroke="hsl(var(--foreground))"
                    fontSize={10}
                    label={{
                      value: "Sprint",
                      position: "insideBottom",
                      offset: -2,
                      fill: "hsl(var(--foreground))",
                      fontSize: 11,
                    }}
                  />
                  <YAxis
                    stroke="hsl(var(--foreground))"
                    fontSize={10}
                    label={{
                      value: "Story Points",
                      angle: -90,
                      position: "insideLeft",
                      fill: "hsl(var(--foreground))",
                      fontSize: 11,
                    }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "var(--radius)",
                      color: "hsl(var(--foreground))",
                      fontSize: 12,
                      padding: "8px 12px",
                      boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.4)",
                    }}
                    itemStyle={{ color: "hsl(var(--foreground))" }}
                    labelStyle={{ color: "hsl(var(--muted-foreground))", marginBottom: 4 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="ideal"
                    stroke="hsl(var(--muted-foreground))"
                    strokeDasharray="4 4"
                    fill="none"
                  />
                  <Area
                    type="monotone"
                    dataKey="points"
                    stroke="var(--chart-1)"
                    fill="url(#v)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card ring-1 ring-border rounded-xl overflow-hidden animate-fade-up">
            <div className="border-b border-border px-6 py-4 flex items-center justify-between">
              <h3 className="font-display font-bold">Current Sprint: {sprint.name}</h3>
              <span className="text-xs font-mono text-muted-foreground">
                {sprint.completedPoints} / {sprint.totalPoints} pts · {sprint.daysRemaining}d left
              </span>
            </div>
            <div className="p-4 grid grid-cols-4 gap-3">
              {[
                { label: "Todo", items: sprint.columns.todo, color: "border-zinc-700" },
                { label: "In Progress", items: sprint.columns.progress, color: "border-primary" },
                { label: "Review", items: sprint.columns.review, color: "border-accent" },
                { label: "Done", items: sprint.columns.done, color: "border-emerald-900" },
              ].map((col) => (
                <div
                  key={col.label}
                  className={`bg-background/40 p-3 rounded-lg border-l-2 ${col.color}`}
                >
                  <div className="text-[10px] font-mono text-muted-foreground mb-3 uppercase tracking-widest">
                    {col.label} ({col.items.length})
                  </div>
                  <div className="space-y-2">
                    {col.items.slice(0, 2).map((t) => (
                      <div key={t.id} className="bg-card border border-border p-2.5 rounded">
                        <div className="text-[11px] font-medium leading-tight mb-2">{t.title}</div>
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-mono text-muted-foreground">{t.id}</span>
                          <span className="size-5 rounded-full bg-secondary text-[9px] font-mono flex items-center justify-center">
                            {t.assignee}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="col-span-12 lg:col-span-4">
          <div className="bg-card ring-1 ring-border rounded-xl p-6 animate-fade-up h-full flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Sparkles className="size-4 text-primary" />
              </div>
              <h3 className="font-display font-bold">AI Intelligence Stream</h3>
            </div>
            <div className="flex-1 space-y-5 overflow-y-auto pr-2">
              {insights.map((ins, i) => {
                const colorMap = {
                  risk: "border-accent text-accent",
                  wins: "border-primary text-primary",
                  info: "border-zinc-700 text-muted-foreground",
                };
                const c = colorMap[ins.kind];
                return (
                  <div key={i} className={`relative pl-4 border-l ${c.split(" ")[0]}/40`}>
                    <div
                      className={`absolute -left-[4.5px] top-0 size-2 ${c.split(" ")[0].replace("border", "bg")} rounded-full`}
                    />
                    <div className={`text-[10px] font-mono uppercase mb-1 ${c.split(" ")[1]}`}>
                      {ins.title}
                    </div>
                    <p className="text-sm text-foreground/90 leading-snug">{ins.body}</p>
                  </div>
                );
              })}
            </div>
            <div className="mt-6 relative">
              <textarea
                placeholder="Ask Enginuity…"
                className="w-full bg-secondary border border-border rounded-lg p-3 pr-12 text-sm focus:outline-none focus:ring-1 focus:ring-primary/40 min-h-20 resize-none"
              />
              <button className="absolute bottom-3 right-3 p-1.5 bg-primary text-primary-foreground rounded hover:opacity-90">
                <Send className="size-4" />
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
