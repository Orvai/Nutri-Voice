import { Router } from "express";
import { authRequired } from "../../middleware/authRequired.js";
import { requireCoach } from "../../middleware/requireRole.js";
import { forward } from "../../utils/forward.js";

const r = Router();
const BASE = process.env.CONVERSATION_SERVICE_URL;

/* ======================================================
   CONVERSATIONS
====================================================== */

/**
 * @openapi
 * /api/conversations:
 *   get:
 *     tags: [Conversations]
 *     summary: Get all conversations of the authenticated coach
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Conversations list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ConversationDto"
 */

r.get(
  "/conversations",
  authRequired,
  requireCoach,
  (req, res, next) => {
    
    const coachId = req.user.id;

    return forward(
      BASE,
      `/internal/coaches/${coachId}/conversations`
    )(req, res, next);
  }
);
/**
 * @openapi
 * /api/conversations/{id}:
 *   get:
 *     tags: [Conversations]
 *     summary: Get single conversation
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Conversation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ConversationDto"
 *       404:
 *         description: Conversation not found
 */
r.get(
  "/conversations/:id",
  authRequired,
  forward(BASE, "/internal/conversations/:id")
);

export default r;
