import { dateKey, todayKey } from "@/lib/date";
import { useActiveList } from "@/store/useTodoStore";
import { useTodoStore } from "@/store/useTodoStore";
import { useT } from "@/store/useUIStore";
import { Flame } from "lucide-react";
import { useMemo } from "react";
import { ProgressRing } from "./ProgressRing";
import { WeeklyChart } from "./WeeklyChart";

function useStreak() {
  const history = useTodoStore((s) => s.history);
  return useMemo(() => {
    let streak = 0;
    const d = new Date();
    if (!history[todayKey()]) d.setDate(d.getDate() - 1);
    for (;;) {
      const key = dateKey(d);
      if (history[key] > 0) {
        streak++;
        d.setDate(d.getDate() - 1);
      } else break;
    }
    return streak;
  }, [history]);
}

export function StatsPanel() {
  const t = useT();
  const list = useActiveList();
  const streak = useStreak();

  const total = list.tasks.length;
  const done = list.tasks.filter((tk) => tk.done).length;
  const percent = total ? (done / total) * 100 : 0;
  const allDone = total > 0 && done === total;

  return (
    <section className="glass mb-4 grid grid-cols-[auto_1fr_auto] items-center gap-4 rounded-2xl p-4">
      <ProgressRing percent={percent} />
      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="text-sm">
          {t("remaining")} <b className="text-primary">{total - done}</b> / {t("total")}{" "}
          <b className="text-primary">{total}</b>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Flame className={streak > 0 ? "h-4 w-4 text-warning" : "h-4 w-4"} />
          <span>
            {t("streak")} <b className="text-warning">{streak}</b> {t("days")}
          </span>
        </div>
        <div className="text-xs font-medium text-[hsl(var(--brand-2))]">
          {allDone ? t("allDone") : t("keepFocus")}
        </div>
      </div>
      <div className="hidden flex-col items-end gap-1 sm:flex">
        <span className="text-[11px] text-muted-foreground">{t("weekly")}</span>
        <WeeklyChart />
      </div>
    </section>
  );
}
