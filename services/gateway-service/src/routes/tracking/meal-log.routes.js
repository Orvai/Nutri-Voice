import { Router } from "express";
import { authRequired } from "../../middleware/authRequired.js";
import { requireCoach } from "../../middleware/requireRole.js";
import { forward } from "../../utils/forward.js";

const r = Router();
const BASE = process.env.TRACKING_SERVICE_URL;

/**
 * @openapi
 * /api/tracking/meal-log:
 *   post:
 *     tags: [Tracking]
 *     summary: Log a meal
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/MealLogCreateRequestDto"
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MealLogResponseDto"
 */

r.post(
  "/meal-log",
  authRequired,
  forward(BASE, "/internal/tracking/meal-log")
);

/**
 * @openapi
 * /api/tracking/meal-log/{logId}:
 *   put:
 *     tags: [Tracking]
 *     summary: Update a meal log
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
 *             $ref: "#/components/schemas/MealLogUpdateRequestDto"
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MealLogResponseDto"
 */
r.put(
  "/meal-log/:logId",
  authRequired,
  forward(BASE, "/internal/tracking/meal-log/:logId")
);

/**
 * @openapi
 * /api/tracking/meal-log/history/{clientId}:
 *   get:
 *     tags: [Tracking]
 *     summary: Coach views meal history for client
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
 *               $ref: "#/components/schemas/MealLogHistoryResponseDto"
 */
r.get(
  "/meal-log/history/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/meal-log/history/:clientId")
);

export default r;