// src/controllers/webhook.controller.js

const { handleIncomingMessage } = require("../services/webhook.service");
const { IncomingWebhookMessageDto } = require("../dtos/webhook.dto");

function normalizeIncomingWebhook(payload) {
  // Telegram example
  if (payload.message) {
    return {
      fromPhone: String(payload.message.from.id),
      toPhone: process.env.TELEGRAM_COACH_ID,
      channel: "TELEGRAM",
      contentType: "TEXT",
      text: payload.message.text,
      sourceMessageId: String(payload.message.message_id),
    };
  }

  throw new Error("Unsupported webhook payload");
}
const incoming = async (req, res, next) => {
  try {
    console.log(
      "📩 Telegram RAW webhook payload:\n",
      JSON.stringify(req.body, null, 2)
    );
    const normalized = normalizeIncomingWebhook(req.body);
    console.log("🔄 Normalized payload:", normalized);

    const payload = IncomingWebhookMessageDto.parse(normalized);

    await handleIncomingMessage(payload);

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
};


module.exports = { incoming };
