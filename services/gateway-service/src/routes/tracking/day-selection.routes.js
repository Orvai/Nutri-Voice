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
 * /api/tracking/day-selection:
 *   post:
 *     tags: [Tracking]
 *     summary: Client sets day type
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/DaySelectionCreateRequestDto"
 *     responses:
 *       200:
 *         description: Day type updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DaySelectionResponseDto"
 *       400:
 *         description: Invalid payload
 *       401:
 *         description: Unauthorized
 */
r.post(
  "/day-selection",
  ensureClientId,
  forward(BASE, "/internal/tracking/day-selection")
);

/* ======================================================
   COACH ROUTES
====================================================== */

/**
 * @openapi
 * /api/tracking/day-selection/today/{clientId}:
 *   get:
 *     tags: [Tracking]
 *     summary: Coach views today's day type for a client
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
 *         description: Today's day selection
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DaySelectionTodayResponseDto"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (coach only)
 */
r.get(
  "/tracking/day-selection/today/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/day-selection/today/:clientId")
);

export default r;