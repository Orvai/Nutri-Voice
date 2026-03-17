// src/controllers/webhook.controller.js

const { handleIncomingMessage } = require("../services/webhook.service");
const { IncomingWebhookMessageDto } = require("../dtos/webhook.dto");
const { getTelegramFileMeta } = require("../clients/telegram.client");
const { transcribeAudioFromUrl } = require("../clients/openai.client");

function getTelegramRoutingDebug(payload) {
  const message = payload?.message;
  if (!message) return null;

  return {
    updateId: payload?.update_id || null,
    messageId: message?.message_id || null,
    chatId: message?.chat?.id || null,
    chatType: message?.chat?.type || null,
    fromId: message?.from?.id || null,
    fromUsername: message?.from?.username || null,
  };
}

async function normalizeIncomingWebhook(payload) {
  // Telegram incoming update
  if (payload?.message) {
    const message = payload.message;

    if (message.text) {
      return {
        fromPhone: String(message.from.id),
        toPhone: process.env.TELEGRAM_COACH_ID,
        channel: "TELEGRAM",
        contentType: "TEXT",
        text: message.text,
        sourceMessageId: String(message.message_id),
      };
    }

    if (Array.isArray(message.photo) && message.photo.length > 0) {
      const bestPhoto = message.photo[message.photo.length - 1];
      const media = await getTelegramFileMeta(bestPhoto.file_id);
      return {
        fromPhone: String(message.from.id),
        toPhone: process.env.TELEGRAM_COACH_ID,
        channel: "TELEGRAM",
        contentType: "IMAGE",
        text: message.caption || undefined,
        media: {
          mediaUrl: media.mediaUrl,
          mediaMimeType: media.mediaMimeType || "image/jpeg",
        },
        sourceMessageId: String(message.message_id),
      };
    }

    if (message.voice || message.audio) {
      const audio = message.voice || message.audio;
      const media = await getTelegramFileMeta(audio.file_id);

      let transcript = message.caption || undefined;
      if (!transcript) {
        try {
          transcript = await transcribeAudioFromUrl({
            mediaUrl: media.mediaUrl,
            mediaMimeType: audio.mime_type || media.mediaMimeType,
          });
        } catch (err) {
          console.error("Failed to transcribe Telegram audio:", err.message);
        }
      }

      return {
        fromPhone: String(message.from.id),
        toPhone: process.env.TELEGRAM_COACH_ID,
        channel: "TELEGRAM",
        contentType: "AUDIO",
        text: transcript || undefined,
        media: {
          mediaUrl: media.mediaUrl,
          mediaMimeType: audio.mime_type || media.mediaMimeType || "audio/ogg",
          mediaDurationSec: typeof audio.duration === "number" ? audio.duration : undefined,
        },
        sourceMessageId: String(message.message_id),
      };
    }

    if (message.video) {
      const media = await getTelegramFileMeta(message.video.file_id);
      return {
        fromPhone: String(message.from.id),
        toPhone: process.env.TELEGRAM_COACH_ID,
        channel: "TELEGRAM",
        contentType: "VIDEO",
        text: message.caption || undefined,
        media: {
          mediaUrl: media.mediaUrl,
          mediaMimeType: message.video.mime_type || media.mediaMimeType || "video/mp4",
          mediaDurationSec:
            typeof message.video.duration === "number" ? message.video.duration : undefined,
        },
        sourceMessageId: String(message.message_id),
      };
    }

    throw new Error("Unsupported Telegram message type");
  }

  throw new Error("Unsupported webhook payload");
}
const incoming = async (req, res, next) => {
  try {
    const telegramRouting = getTelegramRoutingDebug(req.body);
    if (telegramRouting) {
      console.log("📩 [TELEGRAM][ROUTING]", telegramRouting);
    }

    const normalized = await normalizeIncomingWebhook(req.body);
    console.log("🔄 [WEBHOOK][NORMALIZED]", {
      channel: normalized.channel,
      sourceMessageId: normalized.sourceMessageId,
      fromPhone: normalized.fromPhone,
      toPhone: normalized.toPhone,
      contentType: normalized.contentType,
      chatId: telegramRouting?.chatId || null,
    });

    const payload = IncomingWebhookMessageDto.parse(normalized);

    await handleIncomingMessage(payload);

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};


module.exports = { incoming };
