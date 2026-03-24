export type AssistantQuickAction = "meal" | "workout" | "water" | "calories";

export type AssistantMessage = {
  id: string;
  role: "assistant" | "user" | "system";
  text: string;
  kind: "text" | "confirmation" | "suggestion" | "escalation";
  createdAtLabel: string;
};

export type AssistantState = {
  messages: AssistantMessage[];
  pendingCoachReply: boolean;
  lastAction: AssistantQuickAction | null;
};
