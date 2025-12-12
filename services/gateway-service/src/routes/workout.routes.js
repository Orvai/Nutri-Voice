/**
 * @openapi
 * tags:
 *   - name: Exercises
 *   - name: Workout Templates
 *   - name: Workout Programs
 */

import { Router } from "express";
import { attachUser } from "../middleware/attachUser.js";
import { authRequired } from "../middleware/authRequired.js";
import { requireCoach } from "../middleware/requireRole.js";
import { forward } from "../utils/forward.js";

const r = Router();
const BASE = process.env.WORKOUT_SERVICE_URL;

r.use(attachUser);
/* ======================================================
   EXERCISES
====================================================== */

/**
 * @openapi
 * /api/exercises:
 *   get:
 *     tags: [Exercises]
 *     summary: Get all exercises
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of exercises
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ExerciseResponseDto"
 */
r.get("/exercises",authRequired,forward(BASE, "/internal/workout/exercises"));

/**
 * @openapi
 * /api/exercises/{id}:
 *   get:
 *     tags: [Exercises]
 *     summary: Get exercise by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exercise retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ExerciseResponseDto"
 *       404:
 *         description: Exercise not found
 */
r.get("/exercises/:id",authRequired,forward(BASE, "/internal/workout/exercises/:id"));

/**
 * @openapi
 * /api/exercises:
 *   post:
 *     tags: [Exercises]
 *     summary: Create new exercise
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ExerciseCreateRequestDto"
 *     responses:
 *       201:
 *         description: Exercise created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ExerciseResponseDto"
 *       403:
 *         description: Forbidden (coach only)
 */
r.post("/exercises",authRequired,requireCoach,(req, res, next) => {
    req.body = { ...req.body, coachId: req.user.id };
    next();
  },forward(BASE, "/internal/workout/exercises"));

/**
 * @openapi
 * /api/exercises/{id}:
 *   put:
 *     tags: [Exercises]
 *     summary: Update exercise
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ExerciseUpdateRequestDto"
 *     responses:
 *       200:
 *         description: Exercise updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ExerciseResponseDto"
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Exercise not found
 */
r.put("/exercises/:id",authRequired,requireCoach,
  (req, res, next) => {
    req.body = { ...req.body, coachId: req.user.id };
    next();
  },forward(BASE, "/internal/workout/exercises/:id"));

/**
 * @openapi
 * /api/exercises/{id}:
 *   delete:
 *     tags: [Exercises]
 *     summary: Delete exercise
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Exercise deleted
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Exercise not found
 */
r.delete("/exercises/:id",authRequired,requireCoach,
  (req, res, next) => {
    req.body = { coachId: req.user.id };
    next();
  },forward(BASE, "/internal/workout/exercises/:id"));

/**
 * @openapi
 * /api/exercises/{id}/video:
 *   post:
 *     tags: [Exercises]
 *     summary: Upload or update exercise video
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Video uploaded successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Exercise not found
 */
r.post("/exercises/:id/video",authRequired,requireCoach,forward(BASE, "/internal/workout/exercises/:id/video"));

/**
 * @openapi
 * /api/exercises/uploads/{path}:
 *   get:
 *     tags: [Exercises]
 *     summary: Serve uploaded exercise assets
 *     parameters:
 *       - in: path
 *         name: path
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Asset served
 */
r.use("/uploads", forward(BASE, null, { preservePath: true }));

/* ======================================================
   WORKOUT TEMPLATES
====================================================== */

/**
 * @openapi
 * /api/templates:
 *   get:
 *     tags: [Workout Templates]
 *     summary: Get all workout templates
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workout templates
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/WorkoutTemplateResponseDto"
 */
r.get("/templates",authRequired,forward(BASE, "/internal/workout/templates"));

/**
 * @openapi
 * /api/templates/{id}:
 *   get:
 *     tags: [Workout Templates]
 *     summary: Get workout template by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workout template retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WorkoutTemplateResponseDto"
 *       404:
 *         description: Workout template not found
 */
r.get("/templates/:id",authRequired,forward(BASE, "/internal/workout/templates/:id"));

/**
 * @openapi
 * /api/templates:
 *   post:
 *     tags: [Workout Templates]
 *     summary: Create workout template
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/WorkoutTemplateCreateRequestDto"
 *     responses:
 *       201:
 *         description: Workout template created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WorkoutTemplateResponseDto"
 *       403:
 *         description: Forbidden (coach only)
 */
r.post("/templates",authRequired,requireCoach,(req, res, next) => {
    req.body = { ...req.body, coachId: req.user.id };
    next();
  },forward(BASE, "/internal/workout/templates"));

/**
 * @openapi
 * /api/templates/{id}:
 *   put:
 *     tags: [Workout Templates]
 *     summary: Update workout template
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/WorkoutTemplateUpdateRequestDto"
 *     responses:
 *       200:
 *         description: Workout template updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/WorkoutTemplateResponseDto"
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Workout template not found
 */
r.put("/templates/:id",authRequired,requireCoach,(req, res, next) => {
    req.body = { ...req.body, coachId: req.user.id };
    next();
  },forward(BASE, "/internal/workout/templates/:id"));

/**
 * @openapi
 * /api/templates/{id}:
 *   delete:
 *     tags: [Workout Templates]
 *     summary: Delete workout template
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Workout template deleted
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
 *         description: Workout template not found
 */
r.delete("/templates/:id",authRequired,requireCoach,(req, res, next) => {
    req.body = { coachId: req.user.id };
    next();},forward(BASE, "/internal/workout/templates/:id"));



/* ======================================================
   WORKOUT PROGRAMS
====================================================== */

/**
 * @openapi
 * /api/programs:
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
 * /api/programs/{programId}:
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
 * /api/{clientId}/workout-programs:
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
 * /api/{clientId}/workout-programs/{programId}:
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
 * /api/{clientId}/workout-programs:
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
 *             $ref: "#/components/schemas/WorkoutProgramCreateRequestDto"
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
 * /api/{clientId}/workout-programs/{programId}:
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
r.put("/:clientId/workout-programs/:programId",authRequired,requireCoach,
  (req, res, next) => {
    req.body = {
      ...req.body,
      clientId: req.params.clientId,
      coachId: req.user.id,
    }; next();},
  forward(BASE, "/internal/workout/programs/:programId"));

/**
 * @openapi
 * /api/{clientId}/workout-programs/{programId}:
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
