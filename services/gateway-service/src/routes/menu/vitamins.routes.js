import { Router } from "express";
import { authRequired } from "../../middleware/authRequired.js";
import { requireCoach } from "../../middleware/requireRole.js";
import { forward } from "../../utils/forward.js";

const r = Router();
const BASE = process.env.MENU_SERVICE_URL;

/* ======================================================
   VITAMINS
====================================================== */

/**
 * @openapi
 * /api/vitamins:
 *   get:
 *     tags: [Vitamins]
 *     summary: Get all vitamins
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vitamins
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/VitaminResponseDto"
 */
r.get("/vitamins", authRequired, forward(BASE, "/internal/menu/vitamins"));

/**
 * @openapi
 * /api/vitamins:
 *   post:
 *     tags: [Vitamins]
 *     summary: Create a new vitamin
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/VitaminCreateRequestDto"
 *     responses:
 *       201:
 *         description: Vitamin created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/VitaminResponseDto"
 *       403:
 *         description: Forbidden (coach only)
 */
r.post("/vitamins", authRequired, requireCoach, forward(BASE, "/internal/menu/vitamins"));

export default r;