/**
 * @openapi
 * tags:
 *   - name: Tracking
 */

import { Router } from "express";
import { attachUser } from "../middleware/attachUser.js";
import { authRequired } from "../middleware/authRequired.js";
import { ensureClientId } from "../middleware/ensureClientId.js";
import { requireCoach } from "../middleware/requireRole.js";
import { forward } from "../utils/forward.js";

const r = Router();
const BASE = process.env.TRACKING_SERVICE_URL;

r.use(attachUser);

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
 */
r.post(
  "/tracking/day-selection",
  authRequired,
  ensureClientId,
  forward(BASE, "/internal/tracking/day-selection")
);

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
 */
r.post(
  "/tracking/meal-log",
  authRequired,
  ensureClientId,
  forward(BASE, "/internal/tracking/meal-log")
);

/**
 * @openapi
 * /api/tracking/workout-log:
 *   post:
 *     tags: [Tracking]
 *     summary: Client logs workout of the day
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/WorkoutLogCreateRequestDto"
 *     responses:
 *       200:
 *         description: Workout logged
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WorkoutLogResponseDto"
 */
r.post(
  "/tracking/workout-log",
  authRequired,
  ensureClientId,
  forward(BASE, "/internal/tracking/workout-log")
);

/**
 * @openapi
 * /api/tracking/workout-log/{logId}:
 *   put:
 *     tags: [Tracking]
 *     summary: Client updates workout log
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: logId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/WorkoutLogUpdateRequestDto"
 *     responses:
 *       200:
 *         description: Workout log updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WorkoutLogResponseDto"
 */
r.put(
  "/tracking/workout-log/:logId",
  authRequired,
  ensureClientId,
  forward(BASE, "/internal/tracking/workout-log/:logId")
);

/**
 * @openapi
 * /api/tracking/workout-log/exercise/{exerciseLogId}:
 *   patch:
 *     tags: [Tracking]
 *     summary: Client updates a single exercise entry
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: exerciseLogId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Exercise entry updated
 */
r.patch(
  "/tracking/workout-log/exercise/:exerciseLogId",
  authRequired,
  ensureClientId,
  forward(BASE, "/internal/tracking/workout-log/exercise/:exerciseLogId")
);

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
 * /api/tracking/day-selection/today/{clientId}:
 *   get:
 *     tags: [Tracking]
 *     summary: Coach views today's day type for the client
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: clientId
 *         in: path
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
 */
r.get(
  "/tracking/day-selection/today/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/day-selection/today/:clientId")
);

/**
 * @openapi
 * /api/tracking/meal-log/history/{clientId}:
 *   get:
 *     tags: [Tracking]
 *     summary: Coach views meal log history
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: clientId
 *         in: path
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
 */
r.get(
  "/tracking/meal-log/history/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/meal-log/history/:clientId")
);

/**
 * @openapi
 * /api/tracking/workout-log/history/{clientId}:
 *   get:
 *     tags: [Tracking]
 *     summary: Coach views workout log history
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: clientId
 *         in: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workout log history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WorkoutLogHistoryResponseDto"
 */
r.get(
  "/tracking/workout-log/history/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/workout-log/history/:clientId")
);

/**
 * @openapi
 * /api/tracking/weight-log/history/{clientId}:
 *   get:
 *     tags: [Tracking]
 *     summary: Coach views weight log history
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: clientId
 *         in: path
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
 */
r.get(
  "/tracking/weight-log/history/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/weight-log/history/:clientId")
);

export default r;
