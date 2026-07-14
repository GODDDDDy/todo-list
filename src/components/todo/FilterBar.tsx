import { Button } from "@/components/ui/button";
import { PRIORITIES, PRIORITY_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/useToastStore";
import { useTodoStore } from "@/store/useTodoStore";
import { useLang, useT } from "@/store/useUIStore";
import { CheckCheck, Search, Trash2 } from "lucide-react";

const STATUS = ["all", "active", "done"] as const;

export function FilterBar() {
  const t = useT();
  const lang = useLang();
  const filter = useTodoStore((s) => s.filter);
  const setStatus = useTodoStore((s) => s.setStatus);
  const setPriorityFilter = useTodoStore((s) => s.setPriorityFilter);
  const setSearch = useTodoStore((s) => s.setSearch);
  const clearDone = useTodoStore((s) => s.clearDone);
  const toggleAll = useTodoStore((s) => s.toggleAll);
  const push = useToastStore((s) => s.push);

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      <div className="relative min-w-[150px] flex-1">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          value={filter.search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={t("searchPH")}
          aria-label={t("searchPH")}
          className="h-9 w-full rounded-md border border-border bg-input pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>

      <div className="flex flex-wrap gap-1.5">
        {STATUS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-xs transition-all",
              filter.status === s
                ? "brand-gradient border-transparent text-[#181825] font-medium"
                : "border-border bg-secondary/60 text-muted-foreground hover:text-foreground",
            )}
          >
            {t(s)}
          </button>
        ))}
      </div>

      <div className="flex gap-1.5">
        {PRIORITIES.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setPriorityFilter(filter.priority === p ? null : p)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all",
              filter.priority === p
                ? "border-primary text-primary font-medium"
                : "border-border bg-secondary/60 text-muted-foreground hover:text-foreground",
            )}
          >
            <span className={cn("h-2 w-2 rounded-full", PRIORITY_META[p].dot)} />
            {PRIORITY_META[p].label[lang]}
          </button>
        ))}
      </div>

      <div className="ml-auto flex gap-1.5">
        <Button variant="outline" size="sm" onClick={toggleAll} className="gap-1.5">
          <CheckCheck className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t("toggleAll")}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            clearDone();
            push(t("clearDone"), "success");
          }}
          className="gap-1.5"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t("clearDone")}</span>
        </Button>
      </div>
    </div>
  );
}
