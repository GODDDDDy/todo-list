import { useT } from "@/store/useUIStore";
import { motion } from "framer-motion";
import { ClipboardList } from "lucide-react";

export function EmptyState() {
  const t = useT();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground"
    >
      <ClipboardList className="h-14 w-14 opacity-40" />
      <div>
        <p className="text-base font-medium text-foreground">{t("emptyTitle")}</p>
        <p className="mt-1 text-sm opacity-70">{t("emptySub")}</p>
      </div>
    </motion.div>
  );
}
