import { Router } from "express";
import { authRequired } from "../../middleware/authRequired.js";
import { requireCoach } from "../../middleware/requireRole.js";
import { forward } from "../../utils/forward.js";

const r = Router();
const BASE = process.env.WORKOUT_SERVICE_URL;

/* ======================================================
   WORKOUT PROGRAMS
====================================================== */

/**
 * @openapi
 * /api/workout/programs:
 *   get:
 *     tags: [Workout Programs]
 *     summary: Coach fetches all workout programs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workout programs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/WorkoutProgramResponseDto"
 */
r.get("/programs",authRequired,requireCoach,forward(BASE, "/internal/workout/programs"));

/**
 * @openapi
 * /api/workout/programs/{programId}:
 *   get:
 *     tags: [Workout Programs]
 *     summary: Coach fetches a workout program by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: programId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workout program retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WorkoutProgramResponseDto"
 *       404:
 *         description: Workout program not found
 */
r.get("/programs/:programId",authRequired,requireCoach,forward(BASE, "/internal/workout/programs/:programId"));

/**
 * @openapi
 * /api/workout/{clientId}/workout-programs:
 *   get:
 *     tags: [Workout Programs]
 *     summary: Fetch workout programs for a specific client
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
 *         description: Client workout programs list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/WorkoutProgramResponseDto"
 */
r.get("/:clientId/workout-programs",authRequired,forward(BASE, "/internal/workout/programs"));

/**
 * @openapi
 * /api/workout/{clientId}/workout-programs/{programId}:
 *   get:
 *     tags: [Workout Programs]
 *     summary: Fetch a specific workout program for a client
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: programId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workout program retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WorkoutProgramResponseDto"
 *       404:
 *         description: Workout program not found
 */
r.get("/:clientId/workout-programs/:programId",authRequired,forward(BASE, "/internal/workout/programs/:programId"));

/**
 * @openapi
 * /api/workout/{clientId}/workout-programs:
 *   post:
 *     tags: [Workout Programs]
 *     summary: Coach creates a workout program for a client
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *               templateId:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Workout program created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WorkoutProgramResponseDto"
 *       403:
 *         description: Forbidden (coach only)
 */
r.post("/:clientId/workout-programs",authRequired,requireCoach,(req, res, next) => {
    req.body = {
      ...req.body,
      clientId: req.params.clientId,
      coachId: req.user.id,
    };
    next();
  },forward(BASE, "/internal/workout/programs"));

/**
 * @openapi
 * /api/workout/{clientId}/workout-programs/{programId}:
 *   put:
 *     tags: [Workout Programs]
 *     summary: Coach updates a client's workout program
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: programId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/WorkoutProgramUpdateRequestDto"
 *     responses:
 *       200:
 *         description: Workout program updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WorkoutProgramResponseDto"
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Workout program not found
 */
r.put("/:clientId/workout-programs/:programId",authRequired,requireCoach,forward(BASE, "/internal/workout/programs/:programId"));

/**
 * @openapi
 * /api/workout/{clientId}/workout-programs/{programId}:
 *   delete:
 *     tags: [Workout Programs]
 *     summary: Coach deletes a workout program
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: programId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workout program deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Workout program not found
 */
r.delete("/:clientId/workout-programs/:programId",authRequired,requireCoach,(req, res, next) => {
    req.body = {
      clientId: req.params.clientId,
      coachId: req.user.id,
    }; next();},forward(BASE, "/internal/workout/programs/:programId")
);

export default r;
