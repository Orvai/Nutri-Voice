import { Router } from "express";
import { authRequired } from "../../middleware/authRequired.js";
import { requireCoach } from "../../middleware/requireRole.js";
import { forward } from "../../utils/forward.js";

const r = Router();
const BASE = process.env.CONVERSATION_SERVICE_URL;

/* ======================================================
   INBOX
====================================================== */

/**
 * @openapi
 * /api/inbox/pending:
 *   get:
 *     tags: [Inbox]
 *     summary: Get pending client messages awaiting coach reply
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending messages
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/PendingClientMessageResponseDto"
 */
r.get(
  "/inbox/pending",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/inbox/pending")
);

export default r;
