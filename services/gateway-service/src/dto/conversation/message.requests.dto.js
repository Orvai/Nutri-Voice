const { z } = require("zod");
const { MessageContentTypeEnum } = require("./enums");

/* =========================
   MEDIA INPUT
========================= */

const MediaInputDto = z.object({
  mediaUrl: z.string().url(),
  mediaMimeType: z.string().optional(),
  mediaDurationSec: z.number().int().optional(),
  mediaThumbnail: z.string().optional(),
});

/* =========================
   SEND COACH MESSAGE
========================= */

const SendCoachMessageRequestDto = z
  .object({
    contentType: MessageContentTypeEnum.default("TEXT"),
    text: z.string().optional(),
    media: MediaInputDto.optional(),
  })
  .refine(
    (data) => {
      if (data.contentType === "TEXT") {
        return !!data.text;
      }
      return !!data.media;
    },
    {
      message:
        "TEXT messages require text, MEDIA messages require media",
    }
  );

/* =========================
   PARAMS
========================= */

const ConversationIdParamsDto = z.object({
  id: z.string().min(1),
});

const MessageIdParamsDto = z.object({
  id: z.string().min(1),
});

module.exports = {
  MediaInputDto,
  SendCoachMessageRequestDto,
  ConversationIdParamsDto,
  MessageIdParamsDto,
};
