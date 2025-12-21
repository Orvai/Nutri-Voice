import { Router } from "express";
import { forward } from "../../utils/forward.js";
import verifyTelegramWebhook from "../../middleware/verifyTelegramWebhook.js"

const r = Router();
const BASE = process.env.CONVERSATION_SERVICE_URL;

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
    console.log("🔥 WEBHOOK HIT", {
      headers: req.headers,
      body: req.body,
    });
    next();
  },
  verifyTelegramWebhook,
  forward(BASE, "/internal/webhook/incoming")
);

export default r;
