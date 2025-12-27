import { Router } from "express";
import { authRequired } from "../../middleware/authRequired.js";
import { requireCoach } from "../../middleware/requireRole.js";
import { forward } from "../../utils/forward.js";

const r = Router();
const BASE = process.env.TRACKING_SERVICE_URL;

/**
 * @openapi
 * /api/tracking/metrics-log:
 *   post:
 *     tags: [Tracking]
 *     summary: Log or update daily metrics (steps, water, sleep)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/MetricsLogCreateRequestDto"
 *     responses:
 *       201:
 *         description: Metrics logged successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MetricsLogResponseDto"
 */
r.post(
  "/metrics-log",
  authRequired,
  forward(BASE, "/internal/tracking/metrics-log")
);

/**
 * @openapi
 * /api/tracking/metrics-log/history/{clientId}:
 *   get:
 *     tags: [Tracking]
 *     summary: Get metrics history for a specific client
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: start
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: end
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: List of metrics logs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/MetricsLogResponseDto"
 */
r.get(
  "/metrics-log/history/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/metrics-log/history/:clientId")
);

export default r;
