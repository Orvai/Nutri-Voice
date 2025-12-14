import { Router } from "express";
import { authRequired } from "../../middleware/authRequired.js";
import { requireCoach } from "../../middleware/requireRole.js";
import { forward } from "../../utils/forward.js";

const r = Router();
const BASE = process.env.MENU_SERVICE_URL;

/* ======================================================
   FOOD ROUTES
====================================================== */

/**
 * @openapi
 * /api/food:
 *   get:
 *     tags: [Food]
 *     summary: Get all food items
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of food items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                data:
 *                   type: array
 *                   items:
 *                     $ref: "#/components/schemas/FoodItemResponseDto"
 *
 */
r.get("/food", authRequired, forward(BASE, "/internal/menu/food"));

/**
 * @openapi
 * /api/food:
 *   post:
 *     tags: [Food]
 *     summary: Create new food item
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/FoodItemRequestCreateDto"
 *     responses:
 *       201:
 *         description: Food item created
 */
r.post("/food", authRequired, requireCoach, forward(BASE, "/internal/menu/food"));

/**
 * @openapi
 * /api/food/{id}:
 *   put:
 *     tags: [Food]
 *     summary: Update food item
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
 *             $ref: "#/components/schemas/FoodItemRequestUpdateDto"
 *     responses:
 *       200:
 *         description: Food item updated
 */
r.put("/food/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/food/:id"));

/**
 * @openapi
 * /api/food/{id}:
 *   delete:
 *     tags: [Food]
 *     summary: Delete food item
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
 *         description: Food item deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
r.delete("/food/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/food/:id"));

export default r;