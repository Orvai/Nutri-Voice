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
 */
r.get("/exercises", authRequired, forward(BASE, "/internal/workout/exercises"));

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
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Exercise retrieved
 */
r.get("/exercises/:id", authRequired, forward(BASE, "/internal/workout/exercises/:id"));

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
 */
r.post(
  "/exercises",
  authRequired,
  requireCoach,
  (req, res, next) => {
    req.body = { ...req.body, coachId: req.user.id };
    next();
  },
  forward(BASE, "/internal/workout/exercises")
);

/**
 * @openapi
 * /api/exercises/{id}:
 *   put:
 *     tags: [Exercises]
 *     summary: Update exercise
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ExerciseUpdateRequestDto"
 *     responses:
 *       200:
 *         description: Exercise updated
 */
r.put(
  "/exercises/:id",
  authRequired,
  requireCoach,
  (req, res, next) => {
    req.body = { ...req.body, coachId: req.user.id };
    next();
  },
  forward(BASE, "/internal/workout/exercises/:id")
);

/**
 * @openapi
 * /api/exercises/{id}:
 *   delete:
 *     tags: [Exercises]
 *     summary: Delete exercise
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Exercise deleted
 */
r.delete(
  "/exercises/:id",
  authRequired,
  requireCoach,
  (req, res, next) => {
    req.body = { coachId: req.user.id };
    next();
  },
  forward(BASE, "/internal/workout/exercises/:id")
);

/**
 * @openapi
 * /api/exercises/{id}/video:
 *   post:
 *     tags: [Exercises]
 *     summary: Upload exercise video
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string }
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
 *         description: Video uploaded
 */
r.post(
  "/exercises/:id/video",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/workout/exercises/:id/video")
);

/**
 * @openapi
 * /api/exercises/uploads:
 *   get:
 *     tags: [Exercises]
 *     summary: Serve uploaded exercise assets
 *     responses:
 *       200:
 *         description: Assets served
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
 */
r.get("/templates", authRequired, forward(BASE, "/internal/workout/templates"));

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
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/WorkoutTemplateUpdateRequestDto"
 *     responses:
 *       200:
 *         description: Workout template updated
 */
r.get("/templates/:id", authRequired, forward(BASE, "/internal/workout/templates/:id"));

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
 */
r.post(
  "/templates",
  authRequired,
  requireCoach,
  (req, res, next) => {
    req.body = { ...req.body, coachId: req.user.id };
    next();
  },
  forward(BASE, "/internal/workout/templates")
);

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
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *     responses:
 *       200:
 *         description: Workout template updated
 */
r.put(
  "/templates/:id",
  authRequired,
  requireCoach,
  (req, res, next) => {
    req.body = { ...req.body, coachId: req.user.id };
    next();
  },
  forward(BASE, "/internal/workout/templates/:id")
);

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
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Workout template deleted
 */
r.delete(
  "/templates/:id",
  authRequired,
  requireCoach,
  (req, res, next) => {
    req.body = { coachId: req.user.id };
    next();
  },
  forward(BASE, "/internal/workout/templates/:id")
);



/* ======================================================
   WORKOUT PROGRAMS
====================================================== */

/**
 * @openapi
 * /api/programs:
 *   get:
 *     tags: [Workout Programs]
 *     summary: Coach fetches all programs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of workout programs
 */
r.get("/programs", authRequired, requireCoach, forward(BASE, "/internal/workout/programs"));

/**
 * @openapi
 * /api/programs/{programId}:
 *   get:
 *     tags: [Workout Programs]
 *     summary: Coach fetches a single program
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: programId
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Workout program retrieved
 */
r.get(
  "/programs/:programId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/workout/programs/:programId")
);

/**
 * @openapi
 * /api/{clientId}/workout-programs:
 *   get:
 *     tags: [Workout Programs]
 *     summary: Client or coach fetch client programs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: clientId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Client workout programs list
 */
r.get(
  "/:clientId/workout-programs",
  authRequired,
  forward(BASE, "/internal/workout/programs")
);

/**
 * @openapi
 * /api/{clientId}/workout-programs/{programId}:
 *   get:
 *     tags: [Workout Programs]
 *     summary: Fetch specific program by ID
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: clientId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - name: programId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Client program retrieved
 */
r.get(
  "/:clientId/workout-programs/:programId",
  authRequired,
  forward(BASE, "/internal/workout/programs/:programId")
);

/**
 * @openapi
 * /api/{clientId}/workout-programs:
 *   post:
 *     tags: [Workout Programs]
 *     summary: Coach assigns program to client
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/WorkoutProgramCreateRequestDto"
 *     responses:
 *       201:
 *         description: Workout program created
 */
r.post(
  "/:clientId/workout-programs",
  authRequired,
  requireCoach,
  (req, res, next) => {
    req.body = {
      ...req.body,
      clientId: req.params.clientId,
      coachId: req.user.id,
    };
    next();
  },
  forward(BASE, "/internal/workout/programs")
);

/**
 * @openapi
 * /api/{clientId}/workout-programs/{programId}:
 *   put:
 *     tags: [Workout Programs]
 *     summary: Coach updates client's workout program
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: clientId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - name: programId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/WorkoutProgramUpdateRequestDto"
 *     responses:
 *       200:
 *         description: Workout program updated
 */
r.put(
  "/:clientId/workout-programs/:programId",
  authRequired,
  requireCoach,
  (req, res, next) => {
    req.body = {
      ...req.body,
      clientId: req.params.clientId,
      coachId: req.user.id,
    };
    next();
  },
  forward(BASE, "/internal/workout/programs/:programId")
);

/**
 * @openapi
 * /api/{clientId}/workout-programs/{programId}:
 *   delete:
 *     tags: [Workout Programs]
 *     summary: Coach deletes program
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: clientId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *       - name: programId
 *         in: path
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Workout program deleted
 */
r.delete(
  "/:clientId/workout-programs/:programId",
  authRequired,
  requireCoach,
  (req, res, next) => {
    req.body = {
      clientId: req.params.clientId,
      coachId: req.user.id,
    };
    next();
  },
  forward(BASE, "/internal/workout/programs/:programId")
);

export default r;
