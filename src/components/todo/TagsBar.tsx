import { cn } from "@/lib/utils";
import { useActiveList } from "@/store/useTodoStore";
import { useTodoStore } from "@/store/useTodoStore";
import { Hash } from "lucide-react";

export function TagsBar() {
  const list = useActiveList();
  const tag = useTodoStore((s) => s.filter.tag);
  const setTagFilter = useTodoStore((s) => s.setTagFilter);

  const tags = Array.from(new Set(list.tasks.flatMap((tk) => tk.tags)));
  if (tags.length === 0) return null;

  return (
    <div className="mb-3 flex flex-wrap items-center gap-1.5">
      {tags.map((tg) => (
        <button
          key={tg}
          type="button"
          onClick={() => setTagFilter(tag === tg ? null : tg)}
          className={cn(
            "flex items-center gap-1 rounded-md border px-2 py-1 text-[11px] transition-all",
            tag === tg
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-secondary/60 text-muted-foreground hover:text-foreground",
          )}
        >
          <Hash className="h-3 w-3" />
          {tg}
        </button>
      ))}
    </div>
  );
}
