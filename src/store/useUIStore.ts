import { STORAGE_KEYS } from "@/lib/constants";
import { type I18nKey, makeT } from "@/lib/i18n";
import type { Lang, Theme } from "@/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UIState {
  theme: Theme;
  accent: string;
  lang: Lang;
  setTheme: (t: Theme) => void;
  setAccent: (hex: string) => void;
  setLang: (l: Lang) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      theme: "dark",
      accent: "#cba6f7",
      lang: "zh",
      setTheme: (theme) => set({ theme }),
      setAccent: (accent) => set({ accent }),
      setLang: (lang) => set({ lang }),
    }),
    { name: STORAGE_KEYS.ui },
  ),
);

export function useT() {
  const lang = useUIStore((s) => s.lang);
  return makeT(lang) as (k: I18nKey) => string;
}

export function useLang() {
  return useUIStore((s) => s.lang);
}
