import { DAILY_TEMPLATE, STORAGE_KEYS } from "@/lib/constants";
import { todayKey } from "@/lib/date";
import { uid } from "@/lib/id";
import type { Filter, HistoryMap, Priority, StatusFilter, SubTask, Task, TaskList } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface TodoState {
  lists: TaskList[];
  activeListId: string;
  filter: Filter;
  history: HistoryMap;

  setActiveList: (id: string) => void;
  addList: (name: string, icon?: string) => void;
  renameList: (id: string, name: string) => void;
  deleteList: (id: string) => void;

  addTask: (text: string, opts?: Partial<Task>) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleDone: (id: string) => void;
  pinTask: (id: string) => void;
  reorderTasks: (sourceId: string, targetId: string) => void;
  clearDone: () => void;
  toggleAll: () => void;
  addSubtask: (taskId: string, text: string) => void;
  toggleSubtask: (taskId: string, subId: string) => void;
  updateSubtask: (taskId: string, subId: string, text: string) => void;
  deleteSubtask: (taskId: string, subId: string) => void;

  setFilter: (patch: Partial<Filter>) => void;
  setStatus: (s: StatusFilter) => void;
  setPriorityFilter: (p: Priority | null) => void;
  setTagFilter: (t: string | null) => void;
  setSearch: (s: string) => void;

  addTemplate: (lang: "zh" | "en") => void;
  importData: (data: Partial<TodoState>) => void;
}

function makeTask(text: string, opts?: Partial<Task>): Task {
  return {
    id: uid("t_"),
    text,
    done: false,
    priority: null,
    tags: [],
    due: null,
    pinned: false,
    subtasks: [],
    createdAt: Date.now(),
    completedAt: null,
    ...opts,
  };
}

function defaultLists(): TaskList[] {
  return [
    { id: uid("l_"), name: "工作", icon: "💼", tasks: [] },
    { id: uid("l_"), name: "生活", icon: "🌿", tasks: [] },
    { id: uid("l_"), name: "学习", icon: "📚", tasks: [] },
  ];
}

const initial = defaultLists();

export const useTodoStore = create<TodoState>()(
  persist(
    (set, get) => ({
      lists: initial,
      activeListId: initial[0].id,
      filter: { status: "all", priority: null, tag: null, search: "" },
      history: {},

      setActiveList: (id) =>
        set({ activeListId: id, filter: { status: "all", priority: null, tag: null, search: "" } }),

      addList: (name, icon = "📝") => {
        const list: TaskList = { id: uid("l_"), name, icon, tasks: [] };
        set((s) => ({ lists: [...s.lists, list], activeListId: list.id }));
      },

      renameList: (id, name) =>
        set((s) => ({ lists: s.lists.map((l) => (l.id === id ? { ...l, name } : l)) })),

      deleteList: (id) =>
        set((s) => {
          if (s.lists.length <= 1) return s;
          const lists = s.lists.filter((l) => l.id !== id);
          const activeListId = s.activeListId === id ? lists[0].id : s.activeListId;
          return { lists, activeListId };
        }),

      addTask: (text, opts) =>
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === s.activeListId ? { ...l, tasks: [makeTask(text, opts), ...l.tasks] } : l,
          ),
        })),

      updateTask: (id, patch) =>
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === s.activeListId
              ? { ...l, tasks: l.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) }
              : l,
          ),
        })),

      deleteTask: (id) =>
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === s.activeListId ? { ...l, tasks: l.tasks.filter((t) => t.id !== id) } : l,
          ),
        })),

      toggleDone: (id) =>
        set((s) => {
          const day = todayKey();
          return {
            history: { ...s.history },
            lists: s.lists.map((l) =>
              l.id === s.activeListId
                ? {
                    ...l,
                    tasks: l.tasks.map((t) => {
                      if (t.id !== id) return t;
                      const done = !t.done;
                      if (done) s.history[day] = (s.history[day] || 0) + 1;
                      return { ...t, done, completedAt: done ? Date.now() : null };
                    }),
                  }
                : l,
            ),
          };
        }),

      pinTask: (id) =>
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === s.activeListId
              ? { ...l, tasks: l.tasks.map((t) => (t.id === id ? { ...t, pinned: !t.pinned } : t)) }
              : l,
          ),
        })),

      reorderTasks: (sourceId, targetId) =>
        set((s) => ({
          lists: s.lists.map((l) => {
            if (l.id !== s.activeListId) return l;
            const tasks = [...l.tasks];
            const from = tasks.findIndex((t) => t.id === sourceId);
            const to = tasks.findIndex((t) => t.id === targetId);
            if (from < 0 || to < 0 || from === to) return l;
            const [m] = tasks.splice(from, 1);
            tasks.splice(to, 0, m);
            return { ...l, tasks };
          }),
        })),

      clearDone: () =>
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === s.activeListId ? { ...l, tasks: l.tasks.filter((t) => !t.done) } : l,
          ),
        })),

      toggleAll: () =>
        set((s) => {
          const day = todayKey();
          return {
            history: { ...s.history },
            lists: s.lists.map((l) => {
              if (l.id !== s.activeListId) return l;
              const anyActive = l.tasks.some((t) => !t.done);
              if (anyActive)
                s.history[day] = (s.history[day] || 0) + l.tasks.filter((t) => !t.done).length;
              return {
                ...l,
                tasks: l.tasks.map((t) => ({
                  ...t,
                  done: anyActive,
                  completedAt: anyActive ? Date.now() : null,
                })),
              };
            }),
          };
        }),

      addSubtask: (taskId, text) =>
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === s.activeListId
              ? {
                  ...l,
                  tasks: l.tasks.map((t) =>
                    t.id === taskId
                      ? {
                          ...t,
                          subtasks: [
                            ...t.subtasks,
                            { id: uid("s_"), text, done: false } as SubTask,
                          ],
                        }
                      : t,
                  ),
                }
              : l,
          ),
        })),

      toggleSubtask: (taskId, subId) =>
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === s.activeListId
              ? {
                  ...l,
                  tasks: l.tasks.map((t) =>
                    t.id === taskId
                      ? {
                          ...t,
                          subtasks: t.subtasks.map((x) =>
                            x.id === subId ? { ...x, done: !x.done } : x,
                          ),
                        }
                      : t,
                  ),
                }
              : l,
          ),
        })),

      updateSubtask: (taskId, subId, text) =>
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === s.activeListId
              ? {
                  ...l,
                  tasks: l.tasks.map((t) =>
                    t.id === taskId
                      ? {
                          ...t,
                          subtasks: t.subtasks.map((x) => (x.id === subId ? { ...x, text } : x)),
                        }
                      : t,
                  ),
                }
              : l,
          ),
        })),

      deleteSubtask: (taskId, subId) =>
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === s.activeListId
              ? {
                  ...l,
                  tasks: l.tasks.map((t) =>
                    t.id === taskId
                      ? { ...t, subtasks: t.subtasks.filter((x) => x.id !== subId) }
                      : t,
                  ),
                }
              : l,
          ),
        })),

      setFilter: (patch) => set((s) => ({ filter: { ...s.filter, ...patch } })),
      setStatus: (st) => set((s) => ({ filter: { ...s.filter, status: st } })),
      setPriorityFilter: (p) => set((s) => ({ filter: { ...s.filter, priority: p } })),
      setTagFilter: (tg) => set((s) => ({ filter: { ...s.filter, tag: tg } })),
      setSearch: (q) => set((s) => ({ filter: { ...s.filter, search: q } })),

      addTemplate: (lang) => {
        const items = DAILY_TEMPLATE[lang];
        set((s) => ({
          lists: s.lists.map((l) =>
            l.id === s.activeListId
              ? {
                  ...l,
                  tasks: [
                    ...items.map((it) =>
                      makeTask(it.text, { priority: it.priority, tags: it.tags }),
                    ),
                    ...l.tasks,
                  ],
                }
              : l,
          ),
        }));
      },

      importData: (data) =>
        set((s) => ({
          lists: data.lists?.length ? data.lists : s.lists,
          activeListId: data.lists?.length ? data.lists[0].id : s.activeListId,
          history: data.history ?? s.history,
          filter: { status: "all", priority: null, tag: null, search: "" },
        })),
    }),
    { name: STORAGE_KEYS.todo },
  ),
);

export function useActiveList() {
  return useTodoStore((s) => s.lists.find((l) => l.id === s.activeListId) ?? s.lists[0]);
}
