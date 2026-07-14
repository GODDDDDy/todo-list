import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { useToastStore } from "@/store/useToastStore";
import { useTodoStore } from "@/store/useTodoStore";
import { useT } from "@/store/useUIStore";
import { Mic, Plus } from "lucide-react";
import { useState } from "react";

export function Toolbar() {
  const t = useT();
  const addTask = useTodoStore((s) => s.addTask);
  const push = useToastStore((s) => s.push);
  const [value, setValue] = useState("");

  const submit = () => {
    const text = value.trim();
    if (!text) return;
    addTask(text);
    setValue("");
  };

  const voice = useVoiceInput((text) => {
    setValue(text);
    addTask(text);
  });

  const onVoice = () => {
    if (!voice.supported) {
      push(t("voiceUnsup"), "error");
      return;
    }
    voice.listening ? voice.stop() : voice.start();
  };

  return (
    <div className="mb-3 flex flex-col gap-2.5">
      <div className="flex gap-2">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={t("addPH")}
          maxLength={200}
          aria-label={t("add")}
          className="h-11"
        />
        <Button
          onClick={onVoice}
          variant="outline"
          size="icon"
          className="h-11 w-11 shrink-0"
          aria-label="voice"
        >
          <Mic className={voice.listening ? "h-4 w-4 text-destructive animate-pulse" : "h-4 w-4"} />
        </Button>
        <Button onClick={submit} className="h-11 shrink-0 px-5">
          <Plus className="h-4 w-4" />
          {t("add")}
        </Button>
      </div>
    </div>
  );
}
