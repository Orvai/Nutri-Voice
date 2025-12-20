export type UIConversation = {
  id: string;
  coachId: string;
  clientId: string;
  channel: "WHATSAPP" | "TELEGRAM" | "APP";
  lastMessageAt: string | null;
};
