// src/dtos/conversation.dto.js
const { z } = require("zod");

const ConversationChannelEnum = z.enum([
  "WHATSAPP",
  "TELEGRAM",
  "APP",
]);

const GetOrCreateConversationDto = z.object({
  coachId: z.string().min(1),
  clientId: z.string().min(1),
  channel: ConversationChannelEnum,
});

const GetConversationsByCoachDto = z.object({
  coachId: z.string().min(1),
});

const GetConversationByIdDto = z.object({
  id: z.string().min(1),
});

module.exports = {
  GetOrCreateConversationDto,
  GetConversationsByCoachDto,
  GetConversationByIdDto,
};
