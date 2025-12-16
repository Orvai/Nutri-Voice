import express from "express";
import { z } from "zod";
import { authRequired } from "../../middleware/authRequired.js";
import { requireCoach } from "../../middleware/requireRole.js";

import { forward } from "../../utils/forward.js";

const r = express.Router();
const BASE = process.env.MENU_SERVICE_URL;

/**
 * @openapi
 * /api/meal-templates:
 *   post:
 *     tags: [Meal Templates]
 *     summary: Create a meal template
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/MealTemplateCreateRequestDto"
 *     responses:
 *       201:
 *         description: Meal template created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: "#/components/schemas/MealTemplateResponseDto"
 */
r.post("/meal-templates",authRequired,requireCoach,forward(BASE, "/internal/meal-templates"));

/**
 * @openapi
 * /api/meal-templates:
 *   get:
 *     tags: [Meal Templates]
 *     summary: List meal templates
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Meal templates list
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/MealTemplateResponseDto"
 */
r.get("/meal-templates",authRequired,requireCoach,forward(BASE, "/internal/meal-templates"));

/**
 * @openapi
 * /api/meal-templates/{id}:
 *   get:
 *     tags: [Meal Templates]
 *     summary: Get meal template by ID
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
 *         description: Meal template retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: "#/components/schemas/MealTemplateResponseDto"
 *       404:
 *         description: Meal template not found
 */
r.get("/meal-templates/:id",authRequired,requireCoach,forward(BASE, "/internal/meal-templates/:id"));

/**
 * @openapi
 * /api/meal-templates/{id}:
 *   put:
 *     tags: [Meal Templates]
 *     summary: Update (upsert) meal template
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
 *             $ref: "#/components/schemas/MealTemplateUpdateRequestDto"
 *     responses:
 *       200:
 *         description: Meal template updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: "#/components/schemas/MealTemplateResponseDto"
 */
r.put("/meal-templates/:id",authRequired,requireCoach,forward(BASE, "/internal/meal-templates/:id"));

/**
 * @openapi
 * /api/meal-templates/{id}:
 *   delete:
 *     tags: [Meal Templates]
 *     summary: Delete meal template
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
 *         description: Meal template deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
r.delete("/meal-templates/:id",authRequired,requireCoach,forward(BASE, "/internal/meal-templates/:id"));

export default r;
