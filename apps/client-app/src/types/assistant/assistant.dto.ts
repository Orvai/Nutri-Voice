export type AssistantQuickActionDto = "meal" | "workout" | "water" | "calories";

export type AssistantMessageDto = {
  id: string;
  role: "assistant" | "user" | "system";
  text: string;
  kind: "text" | "confirmation" | "suggestion" | "escalation";
  createdAtIso: string;
};

export type AssistantStateDto = {
  messages: AssistantMessageDto[];
  pendingCoachReply: boolean;
  lastAction: AssistantQuickActionDto | null;
};
