import { Router } from "express";
import { authRequired } from "../../middleware/authRequired.js";
import { requireCoach } from "../../middleware/requireRole.js";
import { forward } from "../../utils/forward.js";

const r = Router();
const BASE = process.env.CONVERSATION_SERVICE_URL;

/* ======================================================
   MESSAGES
====================================================== */

/**
 * @openapi
 * /api/conversations/{id}/messages:
 *   get:
 *     tags: [Messages]
 *     summary: Get messages in conversation
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
 *         description: Messages list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/MessageDto"
 */
r.get(
  "/conversations/:id/messages",
  authRequired,
  forward(BASE, "/internal/conversations/:id/messages")
);

/**
 * @openapi
 * /api/conversations/{id}/messages:
 *   post:
 *     tags: [Messages]
 *     summary: Coach sends a message
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/SendCoachMessageRequestDto"
 *     responses:
 *       201:
 *         description: Message created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MessageDto"
 */
r.post(
  "/conversations/:id/messages",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/conversations/:id/messages")
);

/**
 * @openapi
 * /api/messages/{id}/handled:
 *   post:
 *     tags: [Messages]
 *     summary: Mark client message as handled
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:                      
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [handledBy]
 *             properties:
 *               handledBy:
 *                 type: string
 *                 enum: [AI, COACH]
 *     responses:
 *       200:
 *         description: Message updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MessageDto"
 */
r.post(
  "/messages/:id/handled",
  authRequired,
  forward(BASE, "/internal/messages/:id/handled")
);

export default r;
