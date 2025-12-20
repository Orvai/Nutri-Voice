const { z } = require("zod");
const { ConversationChannelEnum } = require("./enums");

const ConversationDto = z.object({
  id: z.string(),
  coachId: z.string(),
  clientId: z.string(),
  channel: ConversationChannelEnum,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  lastMessageAt: z.string().datetime().nullable(),
});

/* =========================
   RESPONSES
========================= */

const ConversationResponseDto = z.object({
  data: ConversationDto,
});

const ConversationListResponseDto = z.object({
  data: z.array(ConversationDto),
});

module.exports = {
  ConversationDto,
  ConversationResponseDto,
  ConversationListResponseDto,
};
