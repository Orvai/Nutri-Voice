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
 * /api/tracking/meal-log:
 *   post:
 *     tags: [Tracking]
 *     summary: Client logs a meal
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/MealLogCreateRequestDto"
 *     responses:
 *       200:
 *         description: Meal logged
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MealLogResponseDto"
 *       400:
 *         description: Invalid payload
 *       401:
 *         description: Unauthorized
 */
r.post(
  "/tracking/meal-log",
  authRequired,
  ensureClientId,
  forward(BASE, "/internal/tracking/meal-log")
);

/* ======================================================
   COACH ROUTES
====================================================== */

/**
 * @openapi
 * /api/tracking/meal-log/history/{clientId}:
 *   get:
 *     tags: [Tracking]
 *     summary: Coach views meal log history for a client
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
 *         description: Meal log history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MealLogHistoryResponseDto"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (coach only)
 */
r.get(
  "/tracking/meal-log/history/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/meal-log/history/:clientId")
);

/**
 * @openapi
 * /api/tracking/meal-log/{logId}:
 *   put:
 *     tags: [Tracking]
 *     summary: Client updates a meal log
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
 *         description: Meal updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/MealLogResponseDto"
 *       401:
 *         description: Unauthorized
 */
r.put(
  "/tracking/meal-log/:logId",
  authRequired,
  ensureClientId,
  forward(BASE, "/internal/tracking/meal-log/:logId")
);

export default r;