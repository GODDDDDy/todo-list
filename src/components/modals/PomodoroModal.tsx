import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { usePomodoro } from "@/hooks/usePomodoro";
import { cn } from "@/lib/utils";
import { useT } from "@/store/useUIStore";
import { Pause, Play, RotateCcw } from "lucide-react";

interface PomodoroModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function PomodoroModal({ open, onOpenChange }: PomodoroModalProps) {
  const t = useT();
  const pomo = usePomodoro();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm text-center">
        <DialogHeader className="items-center">
          <DialogTitle className="brand-text">{t("pomodoro")}</DialogTitle>
        </DialogHeader>

        <div className="mx-auto my-2 grid h-44 w-44 place-items-center">
          <svg className="-rotate-90" width="176" height="176" viewBox="0 0 176 176">
            <circle
              cx="88"
              cy="88"
              r="78"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="10"
            />
            <circle
              cx="88"
              cy="88"
              r="78"
              fill="none"
              stroke="url(#pomoGrad)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 78}
              strokeDashoffset={2 * Math.PI * 78 * pomo.progress}
              style={{ transition: "stroke-dashoffset 0.5s linear" }}
            />
            <defs>
              <linearGradient id="pomoGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="hsl(var(--brand-2))" />
                <stop offset="100%" stopColor="hsl(var(--brand))" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute flex flex-col items-center">
            <span className="text-4xl font-bold tabular-nums">{pomo.display}</span>
            <span
              className={cn(
                "mt-1 text-xs font-medium uppercase tracking-widest",
                pomo.phase === "focus" ? "text-[hsl(var(--brand-2))]" : "text-success",
              )}
            >
              {t(pomo.phase)}
            </span>
          </div>
        </div>

        <div className="mt-2 flex justify-center gap-3">
          <Button onClick={pomo.running ? pomo.pause : pomo.start} className="gap-2 px-6">
            {pomo.running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            {pomo.running ? t("pause") : t("start")}
          </Button>
          <Button variant="outline" size="icon" onClick={pomo.reset} aria-label={t("reset")}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
