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
 * /api/tracking/workout-log:
 *   post:
 *     tags: [Tracking]
 *     summary: Client logs a workout
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
 *       400:
 *         description: Invalid payload
 *       401:
 *         description: Unauthorized
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
 *     summary: Client updates a workout log
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
 *         description: Workout log updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WorkoutLogResponseDto"
 *       400:
 *         description: Invalid payload
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Workout log not found
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
 *     summary: Client updates a single exercise entry in a workout log
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
 *         description: Exercise entry updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WorkoutLogResponseDto"
 *       400:
 *         description: Invalid payload
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Exercise entry not found
 */
r.patch(
  "/tracking/workout-log/exercise/:exerciseLogId",
  authRequired,
  ensureClientId,
  forward(BASE, "/internal/tracking/workout-log/exercise/:exerciseLogId")
);

/* ======================================================
   COACH ROUTES
====================================================== */

/**
 * @openapi
 * /api/tracking/workout-log/history/{clientId}:
 *   get:
 *     tags: [Tracking]
 *     summary: Coach views workout log history for a client
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
 *         description: Workout log history
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WorkoutLogHistoryResponseDto"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (coach only)
 */
r.get(
  "/tracking/workout-log/history/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/workout-log/history/:clientId")
);

export default r;