import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { PRIORITIES, PRIORITY_META } from "@/lib/constants";
import { uid } from "@/lib/id";
import { cn } from "@/lib/utils";
import { useActiveList, useTodoStore } from "@/store/useTodoStore";
import { useLang, useT } from "@/store/useUIStore";
import type { Priority, SubTask } from "@/types";
import { Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";

interface TaskModalProps {
  taskId: string | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function TaskModal({ taskId, open, onOpenChange }: TaskModalProps) {
  const t = useT();
  const lang = useLang();
  const list = useActiveList();
  const updateTask = useTodoStore((s) => s.updateTask);

  const task = list.tasks.find((tk) => tk.id === taskId) ?? null;

  const [text, setText] = useState("");
  const [priority, setPriority] = useState<Priority | null>(null);
  const [tags, setTags] = useState("");
  const [due, setDue] = useState("");
  const [subs, setSubs] = useState<SubTask[]>([]);

  useEffect(() => {
    if (open && task) {
      setText(task.text);
      setPriority(task.priority);
      setTags(task.tags.join(", "));
      setDue(task.due ?? "");
      setSubs(task.subtasks.map((s) => ({ ...s })));
    }
  }, [open, task]);

  if (!task) return null;

  const save = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    updateTask(task.id, {
      text: trimmed,
      priority,
      tags: tags
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean),
      due: due || null,
      subtasks: subs.filter((s) => s.text.trim()),
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t("editTask")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>{t("taskText")}</Label>
            <Textarea value={text} onChange={(e) => setText(e.target.value)} rows={2} autoFocus />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t("priority")}</Label>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => setPriority(null)}
                className={cn(
                  "flex-1 rounded-md border px-3 py-2 text-xs transition-colors",
                  priority === null
                    ? "border-primary text-primary font-medium"
                    : "border-border text-muted-foreground hover:text-foreground",
                )}
              >
                —
              </button>
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "flex flex-1 items-center justify-center gap-1.5 rounded-md border px-3 py-2 text-xs transition-colors",
                    priority === p
                      ? "border-primary text-primary font-medium"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  <span className={cn("h-2 w-2 rounded-full", PRIORITY_META[p].dot)} />
                  {PRIORITY_META[p].label[lang]}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>{t("tags")}</Label>
              <Input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder={t("tagsPH")}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label>{t("due")}</Label>
              <Input type="date" value={due} onChange={(e) => setDue(e.target.value)} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>{t("subtasks")}</Label>
            <div className="flex flex-col gap-1.5">
              {subs.map((s, i) => (
                <div key={s.id} className="flex items-center gap-2">
                  <Checkbox
                    checked={s.done}
                    onCheckedChange={() =>
                      setSubs((prev) =>
                        prev.map((x, idx) => (idx === i ? { ...x, done: !x.done } : x)),
                      )
                    }
                  />
                  <Input
                    value={s.text}
                    onChange={(e) =>
                      setSubs((prev) =>
                        prev.map((x, idx) => (idx === i ? { ...x, text: e.target.value } : x)),
                      )
                    }
                    className="h-9"
                  />
                  <button
                    type="button"
                    onClick={() => setSubs((prev) => prev.filter((_, idx) => idx !== i))}
                    className="rounded-md p-1.5 text-muted-foreground hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              className="mt-1 w-fit gap-1.5"
              onClick={() => setSubs((prev) => [...prev, { id: uid("s_"), text: "", done: false }])}
            >
              <Plus className="h-3.5 w-3.5" />
              {t("addSub")}
            </Button>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            {t("cancel")}
          </Button>
          <Button onClick={save}>{t("save")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
