import { cn } from "@/lib/utils";
import { useToastStore } from "@/store/useToastStore";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, XCircle } from "lucide-react";

export function Toaster() {
  const toasts = useToastStore((s) => s.toasts);
  return (
    <div className="pointer-events-none fixed bottom-5 left-1/2 z-[100] flex -translate-x-1/2 flex-col items-center gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 380, damping: 28 }}
            className={cn(
              "pointer-events-auto flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm shadow-xl backdrop-blur-xl",
              "bg-card/90 border-border text-card-foreground",
            )}
          >
            {t.type === "success" && <CheckCircle2 className="h-4 w-4 text-success" />}
            {t.type === "error" && <XCircle className="h-4 w-4 text-destructive" />}
            {t.type === "info" && <Info className="h-4 w-4 text-[hsl(var(--brand-2))]" />}
            <span>{t.message}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
