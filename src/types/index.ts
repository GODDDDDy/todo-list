export type Priority = "low" | "med" | "high";

export interface SubTask {
  id: string;
  text: string;
  done: boolean;
}

export interface Task {
  id: string;
  text: string;
  done: boolean;
  priority: Priority | null;
  tags: string[];
  due: string | null; // YYYY-MM-DD
  pinned: boolean;
  subtasks: SubTask[];
  createdAt: number;
  completedAt: number | null;
}

export interface TaskList {
  id: string;
  name: string;
  icon: string;
  tasks: Task[];
}

export type StatusFilter = "all" | "active" | "done";

export interface Filter {
  status: StatusFilter;
  priority: Priority | null;
  tag: string | null;
  search: string;
}

export type Theme = "dark" | "light" | "system";
export type Lang = "zh" | "en";

export interface HistoryMap {
  [date: string]: number; // YYYY-MM-DD -> completed count
}

export interface UIState {
  theme: Theme;
  accent: string; // hex
  lang: Lang;
}
