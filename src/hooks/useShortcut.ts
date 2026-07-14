import { useEffect } from "react";

type Handler = (e: KeyboardEvent) => void;

interface ShortcutOptions {
  /** focus an input/textarea to skip */
  ignoreInputs?: boolean;
}

export function useShortcut(
  combo: { key: string; ctrl?: boolean; meta?: boolean; shift?: boolean },
  handler: Handler,
  options: ShortcutOptions = { ignoreInputs: true },
) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      if (options.ignoreInputs) {
        const target = e.target as HTMLElement;
        const tag = target?.tagName?.toLowerCase();
        if (tag === "input" || tag === "textarea" || target?.isContentEditable) return;
      }
      if (e.key.toLowerCase() !== combo.key.toLowerCase()) return;
      if (!!combo.ctrl !== e.ctrlKey) return;
      if (!!combo.meta !== e.metaKey) return;
      if (!!combo.shift !== e.shiftKey) return;
      e.preventDefault();
      handler(e);
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [combo.key, combo.ctrl, combo.meta, combo.shift, handler, options.ignoreInputs]);
}
