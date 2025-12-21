import { Router } from "express";
import { authRequired } from "../../middleware/authRequired.js";
import { forward } from "../../utils/forward.js";

const r = Router();
const TRACKING_BASE = process.env.TRACKING_SERVICE_URL;

/**
 * @openapi
 * /api/tracking/daily-state:
 *   get:
 *     tags: [Tracking]
 *     summary: Get daily aggregated tracking state
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Daily state snapshot
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/DailyStateResponseDto"
 */
r.get(
  "/tracking/daily-state",
  authRequired,
  forward(TRACKING_BASE, "/internal/tracking/daily-state")
);

export default r;
