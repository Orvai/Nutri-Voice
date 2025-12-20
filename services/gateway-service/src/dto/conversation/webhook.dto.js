const { z } = require("zod");
const { MessageContentTypeEnum } = require("./enums");

/* =========================
   INCOMING WEBHOOK
========================= */

const IncomingWebhookMessageDto = z.object({
  fromPhone: z.string().min(5),
  toPhone: z.string().min(5),

  channel: z.enum(["WHATSAPP", "TELEGRAM", "APP"]),

  contentType: MessageContentTypeEnum,

  text: z.string().optional(),

  media: z
    .object({
      mediaUrl: z.string().url(),
      mediaMimeType: z.string().optional(),
      mediaDurationSec: z.number().int().optional(),
      mediaThumbnail: z.string().optional(),
    })
    .optional(),

  sourceMessageId: z.string().optional(),
});

/* =========================
   RESPONSE
========================= */

const WebhookOkResponseDto = z.object({
  data: z.object({
    ok: z.literal(true),
  }),
});

module.exports = {
  IncomingWebhookMessageDto,
  WebhookOkResponseDto,
};
