import { format, isPast, isToday, parseISO } from "date-fns";

export function todayKey(): string {
  return format(new Date(), "yyyy-MM-dd");
}

export function dateKey(d: Date): string {
  return format(d, "yyyy-MM-dd");
}

export function isOverdue(due: string | null, done: boolean): boolean {
  if (!due || done) return false;
  const d = parseISO(due);
  return isPast(d) && !isToday(d);
}

export function prettyDate(due: string): string {
  return format(parseISO(due), "MM/dd");
}

export function last7Days(): Array<{ key: string; label: string }> {
  const out: Array<{ key: string; label: string }> = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push({ key: dateKey(d), label: format(d, "M/d") });
  }
  return out;
}
