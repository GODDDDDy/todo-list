import { celebrate } from "@/components/effects/Confetti";
import { useActiveList, useTodoStore } from "@/store/useTodoStore";
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { AnimatePresence } from "framer-motion";
import { useEffect, useMemo, useRef } from "react";
import { EmptyState } from "./EmptyState";
import { TaskItem } from "./TaskItem";

export function TaskList() {
  const list = useActiveList();
  const filter = useTodoStore((s) => s.filter);
  const reorderTasks = useTodoStore((s) => s.reorderTasks);

  const visible = useMemo(() => {
    let ts = list.tasks.slice();
    if (filter.status === "active") ts = ts.filter((t) => !t.done);
    else if (filter.status === "done") ts = ts.filter((t) => t.done);
    if (filter.priority) ts = ts.filter((t) => t.priority === filter.priority);
    if (filter.tag) ts = ts.filter((t) => t.tags.includes(filter.tag as string));
    if (filter.search.trim()) {
      const q = filter.search.toLowerCase();
      ts = ts.filter(
        (t) => t.text.toLowerCase().includes(q) || t.tags.some((x) => x.toLowerCase().includes(q)),
      );
    }
    ts.sort((a, b) => Number(b.pinned) - Number(a.pinned));
    return ts;
  }, [list.tasks, filter]);

  const total = list.tasks.length;
  const done = list.tasks.filter((t) => t.done).length;
  const allDone = total > 0 && done === total;
  const prevAllDone = useRef(false);

  useEffect(() => {
    if (allDone && !prevAllDone.current) celebrate();
    prevAllDone.current = allDone;
  }, [allDone]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 120, tolerance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    reorderTasks(String(active.id), String(over.id));
  };

  if (total === 0) return <EmptyState />;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={visible.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <ul className="flex flex-col gap-2.5">
          <AnimatePresence initial={false}>
            {visible.map((task) => (
              <TaskItem key={task.id} task={task} />
            ))}
          </AnimatePresence>
        </ul>
      </SortableContext>
      {visible.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">—</p>}
    </DndContext>
  );
}
