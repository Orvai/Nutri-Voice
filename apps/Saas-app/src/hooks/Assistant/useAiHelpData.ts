import { useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import type { AiMessage, AiTextMessage } from "../../types/ai";
import {
  CoachAssistantRunHistoryItem,
  CoachAssistantRunResponseDto,
  usePostApiCoachAssistantRun,
} from "@common/api/sdk/nutri-api";

const nowLabel = () => "עכשיו";

const createRuntimeId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const initialMessages: AiMessage[] = [
  {
    id: "ai-help-welcome",
    from: "ai",
    type: "text",
    text: "היי! איך אני יכול לעזור לך היום?",
    time: nowLabel(),
  },
];

const isTextMessage = (msg: AiMessage): msg is AiTextMessage => msg.type === "text";

const toAssistantHistory = (messages: AiMessage[]): CoachAssistantRunHistoryItem[] =>
  messages
    .filter(isTextMessage)
    .map((msg) => ({
      role: msg.from === "user" ? ("user" as const) : ("assistant" as const),
      content: msg.text,
    }));

const toAssistantReplyText = (result: CoachAssistantRunResponseDto): string => {
  if (typeof result.replyText === "string" && result.replyText.trim().length > 0) {
    return result.replyText;
  }

  if (typeof result.summary === "string" && result.summary.trim().length > 0) {
    return result.summary;
  }

  switch (result.status) {
    case "clarification_required":
      return "צריך הבהרה קצרה כדי להמשיך.";
    case "out_of_scope":
      return "הבקשה מחוץ לתחום הפעולות של עוזר המאמן.";
    case "escalation_required":
      return "נדרש להסלים את הבקשה לטיפול ידני.";
    default:
      return "הפעולה הושלמה.";
  }
};

export function useAiHelpData() {
  const { user } = useAuth();
  const runCoachAssistantMutation = usePostApiCoachAssistantRun();
  const [messages, setMessages] = useState<AiMessage[]>(initialMessages);
  const messagesRef = useRef<AiMessage[]>(initialMessages);
  const conversationIdRef = useRef<string>(createRuntimeId("coach-ai-conversation"));

  const appendMessage = (msg: AiMessage) => {
    const next = [...messagesRef.current, msg];
    messagesRef.current = next;
    setMessages(next);
  };

  async function sendMessage(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: AiTextMessage = {
      id: createRuntimeId("coach-ai-user"),
      from: "user",
      type: "text",
      text: trimmed,
      time: nowLabel(),
    };

    appendMessage(userMsg);

    if (!user?.id) {
      appendMessage({
        id: createRuntimeId("coach-ai-auth"),
        from: "ai",
        type: "text",
        text: "לא הצלחתי לזהות משתמש מחובר. התחבר מחדש ונסה שוב.",
        time: nowLabel(),
      });
      return; 
    }

    try {
      const response = await runCoachAssistantMutation.mutateAsync({
        data: {
          conversationId: conversationIdRef.current,
          messageId: createRuntimeId("coach-ai-message"),
          sender: "coach",
          userId: user.id,
          userText: trimmed,
          history: toAssistantHistory(messagesRef.current),
        },
      });

      appendMessage({
        id: createRuntimeId("coach-ai-reply"),
        from: "ai",
        type: "text",
        text: toAssistantReplyText(response),
        time: nowLabel(),
      });
    } catch (_error) {
      appendMessage({
        id: createRuntimeId("coach-ai-error"),
        from: "ai",
        type: "text",
        text: "לא הצלחתי להשלים את הבקשה כרגע. נסה שוב בעוד רגע.",
        time: nowLabel(),
      });
    }
  }

  return { messages, sendMessage, isSending: runCoachAssistantMutation.isPending };
}
