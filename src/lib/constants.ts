import type { Priority } from "@/types";

export const STORAGE_KEYS = {
  todo: "todolist:todo:v1",
  ui: "todolist:ui:v1",
} as const;

export const PRIORITIES: Priority[] = ["low", "med", "high"];

export const PRIORITY_META: Record<
  Priority,
  { label: Record<"zh" | "en", string>; dot: string; chip: string }
> = {
  low: {
    label: { zh: "低", en: "Low" },
    dot: "bg-[hsl(var(--brand-2))]",
    chip: "text-[hsl(var(--brand-2))]",
  },
  med: { label: { zh: "中", en: "Med" }, dot: "bg-warning", chip: "text-warning" },
  high: { label: { zh: "高", en: "High" }, dot: "bg-destructive", chip: "text-destructive" },
};

export const POMODORO_WORK = 25 * 60; // seconds
export const POMODORO_BREAK = 5 * 60;

export const ACCENT_PRESETS = [
  "#cba6f7",
  "#89b4fa",
  "#74c7ec",
  "#a6e3a1",
  "#f9e2af",
  "#f38ba8",
  "#f5c2e7",
  "#94e2d5",
];

export const DEFAULT_LIST_ICONS = ["📝", "💼", "🌿", "📚", "🎯", "🛒", "💡", "🏋️"];

export const DAILY_TEMPLATE: Record<
  "zh" | "en",
  Array<{ text: string; priority: Priority | null; tags: string[] }>
> = {
  zh: [
    { text: "规划今日三件最重要的事", priority: "high", tags: ["规划"] },
    { text: "喝水 8 杯", priority: "low", tags: ["健康"] },
    { text: "专注工作 2 小时（番茄钟）", priority: "med", tags: ["专注"] },
    { text: "整理桌面与收件箱", priority: "low", tags: ["整理"] },
    { text: "回顾今日进展并复盘", priority: "med", tags: ["复盘"] },
  ],
  en: [
    { text: "Plan today's top 3 priorities", priority: "high", tags: ["plan"] },
    { text: "Drink 8 glasses of water", priority: "low", tags: ["health"] },
    { text: "Deep work 2 hours (Pomodoro)", priority: "med", tags: ["focus"] },
    { text: "Tidy desk & inbox", priority: "low", tags: ["tidy"] },
    { text: "Review today's progress", priority: "med", tags: ["review"] },
  ],
};
