import { applyTheme, watchSystem } from "@/services/theme";
import { useUIStore } from "@/store/useUIStore";
import { useEffect } from "react";

export function ThemeSync() {
  const theme = useUIStore((s) => s.theme);
  const accent = useUIStore((s) => s.accent);

  useEffect(() => {
    applyTheme(theme, accent);
  }, [theme, accent]);

  useEffect(() => {
    watchSystem(() => useUIStore.getState().theme);
  }, []);

  return null;
}
