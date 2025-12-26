import { Router } from "express";
import { authRequired } from "../../middleware/authRequired.js";
import { requireCoach } from "../../middleware/requireRole.js";
import { forward } from "../../utils/forward.js";

const r = Router();
const BASE = process.env.TRACKING_SERVICE_URL;

/**
 * @openapi
 * /api/tracking/daily-state:
 *   get:
 *     tags: [Tracking]
 *     summary: Get my daily tracking state
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily state
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DailyStateResponseDto"
 */
r.get(
  "/daily-state",
  authRequired,
  forward(BASE, "/internal/tracking/daily-state")
);

/**
 * @openapi
 * /api/tracking/day-selection:
 *   post:
 *     tags: [Tracking]
 *     summary: Set day type (Training/Rest)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/DaySelectionCreateRequestDto"
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DaySelectionResponseDto"
 */
r.post(
  "/day-selection",
  authRequired,
  forward(BASE, "/internal/tracking/day-selection")
);

/**
 * @openapi
 * /api/tracking/day-selection/today/{clientId}:
 *   get:
 *     tags: [Tracking]
 *     summary: Coach views today's selection for a client
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
 *         description: Today's selection
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DaySelectionTodayResponseDto"
 */
r.get(
  "/day-selection/today/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/day-selection/today/:clientId")
);

export default r;