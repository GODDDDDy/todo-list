import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ACCENT_PRESETS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { useT, useUIStore } from "@/store/useUIStore";
import type { Lang, Theme } from "@/types";
import { Check } from "lucide-react";

interface SettingsModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const THEMES: Theme[] = ["dark", "light", "system"];
const LANGS: Lang[] = ["zh", "en"];

export function SettingsModal({ open, onOpenChange }: SettingsModalProps) {
  const t = useT();
  const theme = useUIStore((s) => s.theme);
  const setTheme = useUIStore((s) => s.setTheme);
  const accent = useUIStore((s) => s.accent);
  const setAccent = useUIStore((s) => s.setAccent);
  const lang = useUIStore((s) => s.lang);
  const setLang = useUIStore((s) => s.setLang);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("settings")}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Label className="text-sm text-foreground">{t("theme")}</Label>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {t("dark")} / {t("light")} / {t("system")}
              </p>
            </div>
            <div className="flex gap-1.5">
              {THEMES.map((th) => (
                <button
                  key={th}
                  type="button"
                  onClick={() => setTheme(th)}
                  className={cn(
                    "rounded-md border px-3 py-1.5 text-xs transition-colors",
                    theme === th
                      ? "border-primary text-primary font-medium"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {t(th)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <Label className="text-sm text-foreground">{t("accent")}</Label>
              <p className="mt-0.5 text-xs text-muted-foreground">{t("appName")}</p>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-1.5">
              {ACCENT_PRESETS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setAccent(c)}
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-full border-2 transition-transform hover:scale-110",
                    accent.toLowerCase() === c.toLowerCase()
                      ? "border-foreground"
                      : "border-transparent",
                  )}
                  style={{ background: c }}
                  aria-label={c}
                >
                  {accent.toLowerCase() === c.toLowerCase() && (
                    <Check className="h-3.5 w-3.5 text-white" />
                  )}
                </button>
              ))}
              <input
                type="color"
                value={accent}
                onChange={(e) => setAccent(e.target.value)}
                className="h-7 w-7 cursor-pointer rounded-full border border-border bg-transparent p-0"
                aria-label="custom accent"
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <div>
              <Label className="text-sm text-foreground">{t("language")}</Label>
              <p className="mt-0.5 text-xs text-muted-foreground">中文 / EN</p>
            </div>
            <div className="flex gap-1.5">
              {LANGS.map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLang(l)}
                  className={cn(
                    "rounded-md border px-4 py-1.5 text-xs transition-colors",
                    lang === l
                      ? "border-primary text-primary font-medium"
                      : "border-border text-muted-foreground hover:text-foreground",
                  )}
                >
                  {l === "zh" ? "中" : "EN"}
                </button>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} className="w-full">
            {t("close")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
