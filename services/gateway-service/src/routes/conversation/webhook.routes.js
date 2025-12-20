import { Router } from "express";
import { forward } from "../../utils/forward.js";

const r = Router();
const BASE = process.env.CONVERSATION_SERVICE_URL;

/* ======================================================
   INTERNAL WEBHOOK
====================================================== */

/**
 * @openapi
 * /internal/webhook/incoming:
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
  "/internal/webhook/incoming",
  forward(BASE, "/webhook/incoming")
);

export default r;
