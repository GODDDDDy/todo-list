import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { PRIORITY_META } from "@/lib/constants";
import { isOverdue, prettyDate } from "@/lib/date";
import { cn } from "@/lib/utils";
import { useTodoStore } from "@/store/useTodoStore";
import { useLang, useT } from "@/store/useUIStore";
import type { Task } from "@/types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AnimatePresence, motion } from "framer-motion";
import { GripVertical, Pencil, Pin, Trash2 } from "lucide-react";
import { useState } from "react";
import { TaskModal } from "./TaskModal";

interface TaskItemProps {
  task: Task;
}

export function TaskItem({ task }: TaskItemProps) {
  const t = useT();
  const lang = useLang();
  const toggleDone = useTodoStore((s) => s.toggleDone);
  const pinTask = useTodoStore((s) => s.pinTask);
  const deleteTask = useTodoStore((s) => s.deleteTask);
  const [editing, setEditing] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 20 : undefined,
  } as React.CSSProperties;

  const subTotal = task.subtasks.length;
  const subDone = task.subtasks.filter((s) => s.done).length;
  const overdue = isOverdue(task.due, task.done);

  return (
    <>
      <motion.li
        ref={setNodeRef}
        style={style}
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
        exit={{ opacity: 0, x: 24 }}
        transition={{ type: "spring", stiffness: 420, damping: 32 }}
        className={cn(
          "group flex items-start gap-3 rounded-xl border bg-card/70 p-3.5 backdrop-blur-md transition-colors",
          "border-border hover:border-primary/40",
          task.pinned && "border-warning/40",
          task.done && "opacity-70",
        )}
      >
        <button
          type="button"
          className="mt-0.5 cursor-grab text-muted-foreground/50 hover:text-muted-foreground active:cursor-grabbing"
          aria-label="drag"
          {...attributes}
          {...listeners}
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <Checkbox
          checked={task.done}
          onCheckedChange={() => toggleDone(task.id)}
          className="mt-0.5"
        />

        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-[15px] leading-snug break-words",
              task.done && "text-muted-foreground line-through",
            )}
          >
            {task.text}
          </p>
          {(task.priority || task.tags.length > 0 || task.due || subTotal > 0) && (
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
              {task.priority && (
                <Badge variant={task.priority}>
                  <span
                    className={cn("h-1.5 w-1.5 rounded-full", PRIORITY_META[task.priority].dot)}
                  />
                  {PRIORITY_META[task.priority].label[lang]}
                </Badge>
              )}
              {task.tags.map((tg) => (
                <Badge key={tg} variant="outline">
                  #{tg}
                </Badge>
              ))}
              {task.due && (
                <Badge variant={overdue ? "overdue" : "due"}>📅 {prettyDate(task.due)}</Badge>
              )}
              {subTotal > 0 && (
                <span className="text-[11px] text-muted-foreground">
                  ☑ {subDone}/{subTotal}
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5">
          <button
            type="button"
            onClick={() => pinTask(task.id)}
            aria-label={t("pin")}
            className={cn(
              "rounded-md p-1.5 transition-colors hover:bg-accent",
              task.pinned
                ? "text-warning"
                : "text-muted-foreground opacity-0 group-hover:opacity-100",
            )}
          >
            <Pin className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setEditing(true)}
            aria-label={t("edit")}
            className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-colors hover:bg-accent hover:text-[hsl(var(--brand-2))] group-hover:opacity-100"
          >
            <Pencil className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => deleteTask(task.id)}
            aria-label={t("delete")}
            className="rounded-md p-1.5 text-muted-foreground opacity-0 transition-colors hover:bg-accent hover:text-destructive group-hover:opacity-100"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </motion.li>

      <AnimatePresence>
        {editing && <TaskModal taskId={task.id} open={editing} onOpenChange={setEditing} />}
      </AnimatePresence>
    </>
  );
}
