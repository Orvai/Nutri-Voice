import type { ConversationDto } from "@common/api/sdk/schemas";
import type { UIConversation } from "@/types/ui/conversation/conversation.ui";

export const mapConversationToUI = (
  dto: ConversationDto
): UIConversation => ({
  id: dto.id,
  coachId: dto.coachId,
  clientId: dto.clientId,
  channel: dto.channel,
  lastMessageAt: dto.lastMessageAt,
});


