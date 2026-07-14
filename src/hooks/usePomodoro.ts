import { POMODORO_BREAK, POMODORO_WORK } from "@/lib/constants";
import { useCallback, useEffect, useRef, useState } from "react";

export type PomoPhase = "focus" | "break";

export function usePomodoro() {
  const [phase, setPhase] = useState<PomoPhase>("focus");
  const [secondsLeft, setSecondsLeft] = useState(POMODORO_WORK);
  const [running, setRunning] = useState(false);
  const timer = useRef<number | null>(null);

  const total = phase === "focus" ? POMODORO_WORK : POMODORO_BREAK;

  const stop = useCallback(() => {
    if (timer.current) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
    setRunning(false);
  }, []);

  const tick = useCallback(() => {
    setSecondsLeft((prev) => {
      if (prev <= 1) {
        // phase complete -> notify & switch
        const nextPhase: PomoPhase = phase === "focus" ? "break" : "focus";
        setPhase(nextPhase);
        return nextPhase === "focus" ? POMODORO_WORK : POMODORO_BREAK;
      }
      return prev - 1;
    });
  }, [phase]);

  const start = useCallback(() => {
    if (timer.current) return;
    setRunning(true);
    timer.current = window.setInterval(tick, 1000);
  }, [tick]);

  const pause = useCallback(() => {
    stop();
  }, [stop]);

  const reset = useCallback(() => {
    stop();
    setPhase("focus");
    setSecondsLeft(POMODORO_WORK);
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  return {
    phase,
    secondsLeft,
    running,
    total,
    display: `${mm}:${ss}`,
    progress: 1 - secondsLeft / total,
    start,
    pause,
    reset,
  };
}
