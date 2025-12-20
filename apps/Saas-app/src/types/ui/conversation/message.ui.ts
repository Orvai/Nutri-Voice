export type UIMessage = {
  id: string;
  conversationId: string;

  sender: "CLIENT" | "COACH" | "AI";
  contentType: "TEXT" | "IMAGE" | "AUDIO" | "VIDEO";

  // TEXT
  text?: string | null;

  // MEDIA
  mediaUrl?: string | null;
  mediaThumbnail?: string | null;
  mediaMimeType?: string | null;
  mediaDurationSec?: number | null;

  // AI
  aiDecision?: "AUTO_REPLY" | "COACH_REPLY" | null;
  aiSuggestedReply?: string | null;
  sourceMessageId?: string | null;

  // Handling
  handledAt?: string | null;
  handledBy?: "AI" | "COACH" | null;

  createdAt: string;
};
