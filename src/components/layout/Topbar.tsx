import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useActiveList } from "@/store/useTodoStore";
import { useT, useUIStore } from "@/store/useUIStore";
import { Download, Languages, LayoutTemplate, Moon, Sun, Timer, Upload } from "lucide-react";

interface TopbarProps {
  onOpenPomodoro: () => void;
  onOpenSettings: () => void;
  onAddTemplate: () => void;
  onExport: () => void;
  onImport: () => void;
}

function IconButton({
  label,
  onClick,
  children,
  active,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          onClick={onClick}
          className={active ? "border-primary text-primary" : ""}
        >
          {children}
        </Button>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

export function Topbar({
  onOpenPomodoro,
  onOpenSettings,
  onAddTemplate,
  onExport,
  onImport,
}: TopbarProps) {
  const t = useT();
  const list = useActiveList();
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  const lang = useUIStore((s) => s.lang);
  const setLang = useUIStore((s) => s.setLang);

  const cycleTheme = () => {
    const order = ["dark", "light", "system"] as const;
    const next = order[(order.indexOf(theme) + 1) % order.length];
    setTheme(next);
  };

  return (
    <header className="glass mb-4 flex flex-wrap items-center gap-2 rounded-2xl p-3">
      <div className="mr-auto flex items-center gap-2.5">
        <span className="text-xl">{list.icon}</span>
        <h1 className="text-lg font-semibold tracking-tight">{list.name}</h1>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        <IconButton label={`${t("theme")} · ${t(theme)}`} onClick={cycleTheme}>
          {theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </IconButton>
        <IconButton label={t("language")} onClick={() => setLang(lang === "zh" ? "en" : "zh")}>
          <Languages className="h-4 w-4" />
        </IconButton>
        <IconButton label={t("pomodoro")} onClick={onOpenPomodoro}>
          <Timer className="h-4 w-4" />
        </IconButton>
        <IconButton label={t("quickAdd")} onClick={onAddTemplate}>
          <LayoutTemplate className="h-4 w-4" />
        </IconButton>
        <IconButton label={t("exported")} onClick={onExport}>
          <Download className="h-4 w-4" />
        </IconButton>
        <IconButton label={t("imported")} onClick={onImport}>
          <Upload className="h-4 w-4" />
        </IconButton>
        <Button
          variant="outline"
          size="sm"
          onClick={onOpenSettings}
          className="hidden sm:inline-flex"
        >
          {t("settings")}
        </Button>
      </div>
    </header>
  );
}
