import { Router } from "express";
import { authRequired } from "../../middleware/authRequired.js";
import { requireCoach } from "../../middleware/requireRole.js";
import { forward } from "../../utils/forward.js";

const r = Router();
const BASE = process.env.TRACKING_SERVICE_URL;

/**
 * @openapi
 * /api/tracking/weight-log:
 *   post:
 *     tags: [Tracking]
 *     summary: Log weight
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/WeightLogCreateRequestDto"
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WeightLogResponseDto"
 */

r.post(
  "/weight-log",
  authRequired,
  forward(BASE, "/internal/tracking/weight-log")
);

/**
 * @openapi
 * /api/tracking/weight-log/{logId}:
 *   put:
 *     tags: [Tracking]
 *     summary: Update weight log
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: logId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/WeightLogUpdateRequestDto"
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WeightLogResponseDto"
 */
r.put(
  "/weight-log/:logId",
  authRequired,
  forward(BASE, "/internal/tracking/weight-log/:logId")
);

/**
 * @openapi
 * /api/tracking/weight-log/history/{clientId}:
 *   get:
 *     tags: [Tracking]
 *     summary: Coach views weight history for client
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
 *         description: History
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WeightHistoryResponseDto"
 */

r.get(
  "/weight-log/history/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/weight-log/history/:clientId")
);

export default r;