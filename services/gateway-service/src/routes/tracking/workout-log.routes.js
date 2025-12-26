import { Router } from "express";
import { authRequired } from "../../middleware/authRequired.js";
import { requireCoach } from "../../middleware/requireRole.js";
import { forward } from "../../utils/forward.js";

const r = Router();
const BASE = process.env.TRACKING_SERVICE_URL;

/**
 * @openapi
 * /api/tracking/workout-log:
 *   post:
 *     tags: [Tracking]
 *     summary: Log a workout
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/WorkoutLogCreateRequestDto"
 *     responses:
 *       201:
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WorkoutLogResponseDto"
 */

r.post(
  "/workout-log",
  authRequired,
  forward(BASE, "/internal/tracking/workout-log")
);

/**
 * @openapi
 * /api/tracking/workout-log/{logId}:
 *   put:
 *     tags: [Tracking]
 *     summary: Update workout log header
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
 *             $ref: "#/components/schemas/WorkoutLogUpdateRequestDto"
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WorkoutLogResponseDto"
 */
r.put(
  "/workout-log/:logId",
  authRequired,
  forward(BASE, "/internal/tracking/workout-log/:logId")
);

/**
 * @openapi
 * /api/tracking/workout-log/exercise/{exerciseLogId}:
 *   patch:
 *     tags: [Tracking]
 *     summary: Update specific exercise
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: exerciseLogId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/WorkoutExerciseUpdateDto"
 *     responses:
 *       200:
 *         description: Updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WorkoutLogResponseDto"
 */
r.patch(
  "/workout-log/exercise/:exerciseLogId",
  authRequired,
  forward(BASE, "/internal/tracking/workout-log/exercise/:exerciseLogId")
);

/**
 * @openapi
 * /api/tracking/workout-log/history/{clientId}:
 *   get:
 *     tags: [Tracking]
 *     summary: Coach views workout history for client
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
 *               $ref: "#/components/schemas/WorkoutLogHistoryResponseDto"
 */
r.get(
  "/workout-log/history/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/workout-log/history/:clientId")
);

export default r;