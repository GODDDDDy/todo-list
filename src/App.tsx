import { ThemeSync } from "@/components/effects/ThemeSync";
import { Toaster } from "@/components/effects/Toaster";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";
import { PomodoroModal } from "@/components/modals/PomodoroModal";
import { SettingsModal } from "@/components/modals/SettingsModal";
import { StatsPanel } from "@/components/stats/StatsPanel";
import { FilterBar } from "@/components/todo/FilterBar";
import { TagsBar } from "@/components/todo/TagsBar";
import { TaskList } from "@/components/todo/TaskList";
import { Toolbar } from "@/components/todo/Toolbar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useShortcut } from "@/hooks/useShortcut";
import { type ExportPayload, exportJSON, parseImport } from "@/services/exportImport";
import { useToastStore } from "@/store/useToastStore";
import { useTodoStore } from "@/store/useTodoStore";
import { useLang, useT, useUIStore } from "@/store/useUIStore";
import { Download, Upload } from "lucide-react";
import { useRef, useState } from "react";

export default function App() {
  const t = useT();
  const lang = useLang();
  const [pomoOpen, setPomoOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const addTemplate = useTodoStore((s) => s.addTemplate);
  const importData = useTodoStore((s) => s.importData);
  const push = useToastStore((s) => s.push);

  const handleTemplate = () => {
    addTemplate(lang);
    push(t("templateAdded"), "success");
  };

  const handleExport = () => {
    const { lists, history, activeListId } = useTodoStore.getState();
    const payload: ExportPayload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      lists,
      history,
    };
    exportJSON(payload);
    push(t("exported"), "success");
    // keep activeListId referenced to avoid unused warning
    void activeListId;
  };

  const handleImportClick = () => fileRef.current?.click();

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const data = parseImport(text);
    if (!data) {
      push(t("importFail"), "error");
    } else {
      importData({ lists: data.lists, history: data.history });
      push(t("imported"), "success");
    }
    e.target.value = "";
  };

  // keyboard shortcuts
  useShortcut({ key: "/" }, () => {
    const input = document.querySelector<HTMLInputElement>('input[aria-label="add"]');
    input?.focus();
  });
  useShortcut({ key: "p" }, () => setPomoOpen(true));
  useShortcut({ key: "s" }, () => setSettingsOpen(true));
  useShortcut({ key: "t" }, handleTemplate);

  return (
    <TooltipProvider delayDuration={200}>
      <ThemeSync />
      <div className="glow-bg min-h-screen">
        <div className="mx-auto grid max-w-[1100px] grid-cols-1 gap-4 px-4 py-6 md:grid-cols-[230px_1fr] md:px-6">
          <Sidebar onOpenSettings={() => setSettingsOpen(true)} />

          <main className="min-w-0">
            <Topbar
              onOpenPomodoro={() => setPomoOpen(true)}
              onOpenSettings={() => setSettingsOpen(true)}
              onAddTemplate={handleTemplate}
              onExport={handleExport}
              onImport={handleImportClick}
            />

            <StatsPanel />

            <Toolbar />
            <FilterBar />
            <TagsBar />

            <TaskList />

            <footer className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground">
              <Download className="h-3 w-3" />
              <span>导出备份</span>
              <span className="opacity-40">·</span>
              <Upload className="h-3 w-3" />
              <span>导入恢复</span>
              <span className="opacity-40">·</span>
              <span>数据本地存储</span>
            </footer>
          </main>
        </div>
      </div>

      <PomodoroModal open={pomoOpen} onOpenChange={setPomoOpen} />
      <SettingsModal open={settingsOpen} onOpenChange={setSettingsOpen} />
      <Toaster />

      <input
        ref={fileRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleFile}
      />
    </TooltipProvider>
  );
}
