import { Router } from "express";
import { authRequired } from "../../middleware/authRequired.js";
import { ensureClientId } from "../../middleware/ensureClientId.js";
import { requireCoach } from "../../middleware/requireRole.js";
import { forward } from "../../utils/forward.js";

const r = Router();
const BASE = process.env.TRACKING_SERVICE_URL;

/* ======================================================
   CLIENT ROUTES
====================================================== */

/**
 * @openapi
 * /api/tracking/weight-log:
 *   post:
 *     tags: [Tracking]
 *     summary: Client logs body weight
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/WeightLogCreateRequestDto"
 *     responses:
 *       200:
 *         description: Weight logged
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WeightLogResponseDto"
 *       400:
 *         description: Invalid payload
 *       401:
 *         description: Unauthorized
 */
r.post(
  "/tracking/weight-log",
  authRequired,
  ensureClientId,
  forward(BASE, "/internal/tracking/weight-log")
);

/* ======================================================
   COACH ROUTES
====================================================== */

/**
 * @openapi
 * /api/tracking/weight-log/history/{clientId}:
 *   get:
 *     tags: [Tracking]
 *     summary: Coach views weight log history for a client
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Weight log history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WeightHistoryResponseDto"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (coach only)
 */
r.get(
  "/tracking/weight-log/history/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/weight-log/history/:clientId")
);

export default r;