// src/dtos/webhook.dto.js
const { z } = require("zod");

const MessageContentTypeEnum = z.enum([
  "TEXT",
  "IMAGE",
  "AUDIO",
  "VIDEO",
]);

const IncomingWebhookMessageDto = z.object({
  fromPhone: z.string().min(1),
  toPhone: z.string().min(1),
  channel: z.enum(["WHATSAPP", "TELEGRAM", "APP"]),
  contentType: MessageContentTypeEnum,
  text: z.string().optional(),
  media: z
    .object({
      mediaUrl: z.string().url().optional(),
      mediaMimeType: z.string().optional(),
      mediaDurationSec: z.number().int().optional(),
      mediaThumbnail: z.string().optional(),
    })
    .optional(),
  sourceMessageId: z.string().optional(),
});

module.exports = { IncomingWebhookMessageDto };
