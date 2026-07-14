import type { HistoryMap, TaskList } from "@/types";

export interface ExportPayload {
  version: 1;
  exportedAt: string;
  lists: TaskList[];
  history: HistoryMap;
}

export function exportJSON(payload: ExportPayload) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `todo-list-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function parseImport(text: string): ExportPayload | null {
  const data = JSON.parse(text);
  if (!data || !Array.isArray(data.lists)) {
    console.error("Invalid import payload");
    return null;
  }
  return {
    version: 1,
    exportedAt: data.exportedAt ?? new Date().toISOString(),
    lists: data.lists,
    history: data.history ?? {},
  };
}
