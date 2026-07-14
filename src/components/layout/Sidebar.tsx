import { Button } from "@/components/ui/button";
import { PRIORITY_META } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/useToastStore";
import { useTodoStore } from "@/store/useTodoStore";
import { useT } from "@/store/useUIStore";
import { motion } from "framer-motion";
import { ListPlus, Settings, Trash2 } from "lucide-react";

interface SidebarProps {
  onOpenSettings: () => void;
}

export function Sidebar({ onOpenSettings }: SidebarProps) {
  const t = useT();
  const lists = useTodoStore((s) => s.lists);
  const activeListId = useTodoStore((s) => s.activeListId);
  const setActiveList = useTodoStore((s) => s.setActiveList);
  const addList = useTodoStore((s) => s.addList);
  const deleteList = useTodoStore((s) => s.deleteList);
  const push = useToastStore((s) => s.push);

  const handleAdd = () => {
    const name = window.prompt(t("newList"), t("newList"));
    if (name && name.trim()) addList(name.trim());
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`${t("confirmDelList")}\n(${name})`)) deleteList(id);
  };

  return (
    <aside className="glass sticky top-6 hidden h-fit w-[230px] flex-col rounded-2xl p-4 md:flex">
      <div className="mb-4 flex items-center gap-2 px-1">
        <span className="h-3 w-3 rounded-full brand-gradient" />
        <span className="text-base font-bold brand-text">{t("appName")}</span>
      </div>

      <p className="px-2 pb-2 text-[11px] uppercase tracking-wider text-muted-foreground">
        {t("lists")}
      </p>
      <nav className="flex flex-1 flex-col gap-1">
        {lists.map((l) => {
          const remaining = l.tasks.filter((tk) => !tk.done).length;
          const active = l.id === activeListId;
          return (
            <motion.button
              key={l.id}
              type="button"
              whileHover={{ x: 2 }}
              onClick={() => setActiveList(l.id)}
              className={cn(
                "group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm transition-colors",
                active
                  ? "bg-secondary text-secondary-foreground"
                  : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground",
              )}
            >
              <span className="text-base leading-none">{l.icon}</span>
              <span className="flex-1 truncate text-left">{l.name}</span>
              <span className="rounded-full bg-background/60 px-2 py-0.5 text-[10px] text-muted-foreground">
                {remaining}
              </span>
              {lists.length > 1 && (
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(l.id, l.name);
                  }}
                  className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-destructive"
                  aria-label="delete list"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </span>
              )}
            </motion.button>
          );
        })}
      </nav>

      <Button
        variant="ghost"
        size="sm"
        className="mt-3 justify-start border border-dashed border-border text-muted-foreground"
        onClick={handleAdd}
      >
        <ListPlus className="h-4 w-4" />
        {t("newList")}
      </Button>

      <div className="mt-4 border-t border-border pt-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={onOpenSettings}
        >
          <Settings className="h-4 w-4" />
          {t("settings")}
        </Button>
      </div>
    </aside>
  );
}

export { PRIORITY_META };
