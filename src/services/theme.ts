import { hexToHslCss, readableText, shiftHue } from "@/lib/color";
import type { Theme } from "@/types";

function systemDark(): boolean {
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function resolveTheme(theme: Theme): "dark" | "light" {
  return theme === "system" ? (systemDark() ? "dark" : "light") : theme;
}

export function applyResolved(resolved: "dark" | "light") {
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
}

export function applyAccent(hex: string) {
  const root = document.documentElement;
  root.style.setProperty("--primary", hexToHslCss(hex));
  root.style.setProperty("--ring", hexToHslCss(hex));
  root.style.setProperty("--brand", hexToHslCss(hex));
  root.style.setProperty("--brand-2", hexToHslCss(shiftHue(hex, -28)));
  root.style.setProperty("--primary-foreground", readableText(hex));
}

export function applyTheme(theme: Theme, accent: string) {
  applyResolved(resolveTheme(theme));
  applyAccent(accent);
}

let mqBound = false;
export function watchSystem(themeRef: () => Theme) {
  if (mqBound) return;
  mqBound = true;
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => {
    if (themeRef() === "system") applyResolved(systemDark() ? "dark" : "light");
  };
  mq.addEventListener("change", handler);
}
