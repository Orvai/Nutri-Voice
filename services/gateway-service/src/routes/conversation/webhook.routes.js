import { Router } from "express";
import { forward } from "../../utils/forward.js";
import verifyTelegramWebhook from "../../middleware/verifyTelegramWebhook.js";

const r = Router();
const BASE = process.env.CONVERSATION_SERVICE_URL;

const extractTelegramMetadata = (payload = {}) => {
  const message =
    payload?.message ||
    payload?.edited_message ||
    payload?.channel_post ||
    payload?.edited_channel_post ||
    payload?.callback_query?.message;
  const from = payload?.message?.from || payload?.callback_query?.from;

  return {
    updateId: payload?.update_id || null,
    messageId: message?.message_id || null,
    chatId: message?.chat?.id || null,
    chatType: message?.chat?.type || null,
    fromId: from?.id || null,
    fromUsername: from?.username || null,
    textPreview: typeof message?.text === "string" ? message.text.slice(0, 120) : null,
  };
};

/* ======================================================
   INTERNAL WEBHOOK
====================================================== */

/**
 * @openapi
 * /api/webhook/incoming:
 *   post:
 *     tags: [Webhook]
 *     summary: Incoming external message (Telegram / WhatsApp / App)
 *     security:
 *       - internalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/IncomingWebhookMessageDto"
 *     responses:
 *       200:
 *         description: Message processed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WebhookOkResponseDto"
 */
r.post(
  "/incoming",
  (req, res, next) => {
    const forwardedFor = req.headers["x-forwarded-for"];
    const sourceIp = typeof forwardedFor === "string"
      ? forwardedFor.split(",")[0].trim()
      : req.ip;

    console.log("🌐 [NGROK][WEBHOOK] Incoming request", {
      method: req.method,
      path: req.originalUrl,
      sourceIp,
      forwardedFor,
      forwardedHost: req.headers["x-forwarded-host"],
      forwardedProto: req.headers["x-forwarded-proto"],
      userAgent: req.headers["user-agent"],
      hasTelegramSecret: Boolean(req.headers["x-telegram-bot-api-secret-token"]),
      telegram: extractTelegramMetadata(req.body),
    });
    next();
  },
  verifyTelegramWebhook,
  forward(BASE, "/internal/webhook/incoming")
);

export default r;
