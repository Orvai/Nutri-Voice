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
 *     summary: Get tracking state (Self or Client)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: clientId
 *         required: false
 *         description: Optional clientId for coach viewing a client
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Daily tracking state
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
 * /api/tracking/daily-state/range:
 *   get:
 *     tags: [Tracking]
 *     summary: Get tracking state for a range of dates
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         description: Start date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: endDate
 *         required: true
 *         description: End date (YYYY-MM-DD)
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of daily states for the requested range
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/DailyStateResponseDto"
 */
r.get("/daily-state/range",authRequired,forward(BASE,"/internal/tracking/range-state"));


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