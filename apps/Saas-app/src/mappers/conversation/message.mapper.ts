import type { MessageDto } from "@common/api/sdk/schemas";
import type { UIMessage } from "@/types/ui/conversation/message.ui";

export const mapMessageToUI = (dto: MessageDto): UIMessage => ({
  id: dto.id,
  conversationId: dto.conversationId,

  sender: dto.sender,
  contentType: dto.contentType,

  text: dto.text ?? null,

  mediaUrl: dto.mediaUrl ?? null,
  mediaThumbnail: dto.mediaThumbnail ?? null,
  mediaMimeType: dto.mediaMimeType ?? null,
  mediaDurationSec: dto.mediaDurationSec ?? null,

  aiDecision: dto.aiDecision ?? null,
  aiSuggestedReply: dto.aiSuggestedReply ?? null,
  sourceMessageId: dto.sourceMessageId ?? null,

  handledAt: dto.handledAt ?? null,
  handledBy: dto.handledBy ?? null,

  createdAt: dto.createdAt,
});
