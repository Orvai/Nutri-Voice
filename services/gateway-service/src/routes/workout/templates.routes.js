import { Router } from "express";
import { authRequired } from "../../middleware/authRequired.js";
import { requireCoach } from "../../middleware/requireRole.js";
import { forward } from "../../utils/forward.js";

const r = Router();
const BASE = process.env.WORKOUT_SERVICE_URL;

/* ======================================================
   WORKOUT TEMPLATES
====================================================== */

/**
 * @openapi
 * /api/workout/templates:
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
 * /api/workout/templates/{id}:
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
 * /api/workout/templates:
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
 * /api/workout/templates/{id}:
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
 * /api/workout/templates/{id}:
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

export default r;