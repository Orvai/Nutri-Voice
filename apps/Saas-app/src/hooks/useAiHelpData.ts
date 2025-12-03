import { useState } from "react";
import { AiMessage } from "../types/ai";

export function useAiHelpData() {
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: "1",
      from: "ai",
      type: "text",
      text: "היי! איך אני יכול לעזור לך היום?",
      time: "עכשיו",
    },
  ]);

  function sendMessage(text: string) {
    if (!text.trim()) return;

    const userMsg: AiMessage = {
      id: Date.now().toString(),
      from: "user",
      type: "text",
      text,
      time: "עכשיו",
    };

    setMessages((prev) => [...prev, userMsg]);

    // תגובת AI מדומה
    setTimeout(() => {
      const aiResponse: AiMessage = {
        id: Date.now().toString() + "_ai",
        from: "ai",
        type: "text",
        text: "קיבלתי! מעבד את הנתונים...",
        time: "עכשיו",
      };

      setMessages((prev) => [...prev, aiResponse]);
    }, 800);
  }

  return { messages, sendMessage };
}
