import { last7Days } from "@/lib/date";
import { useTodoStore } from "@/store/useTodoStore";
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

export function WeeklyChart() {
  const history = useTodoStore((s) => s.history);
  const data = last7Days().map((d) => ({ name: d.label, count: history[d.key] || 0 }));

  return (
    <div className="h-[46px] w-[150px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(var(--brand))" />
              <stop offset="100%" stopColor="hsl(var(--brand-2))" />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            tick={{ fontSize: 9, fill: "hsl(var(--muted-foreground))" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
            contentStyle={{
              background: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: 8,
              fontSize: 12,
              color: "hsl(var(--popover-foreground))",
            }}
            labelStyle={{ color: "hsl(var(--muted-foreground))" }}
          />
          <Bar dataKey="count" fill="url(#barGrad)" radius={[4, 4, 2, 2]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
