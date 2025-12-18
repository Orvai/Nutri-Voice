import { Router } from "express";
import { authRequired } from "../../middleware/authRequired.js";
import { requireCoach } from "../../middleware/requireRole.js";
import { forward } from "../../utils/forward.js";

const r = Router();
const BASE = process.env.WORKOUT_SERVICE_URL;

/* ======================================================
   EXERCISES
====================================================== */

/**
 * @openapi
 * /api/workout/exercises:
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

export default r;