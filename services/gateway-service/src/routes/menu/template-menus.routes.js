import { Router } from "express";
import { authRequired } from "../../middleware/authRequired.js";
import { requireCoach } from "../../middleware/requireRole.js";
import { forward } from "../../utils/forward.js";

const r = Router();
const BASE = process.env.MENU_SERVICE_URL;

/* ======================================================
   TEMPLATE MENUS
====================================================== */

/**
 * @openapi
 * /api/template-menus:
 *   get:
 *     tags: [Template Menus]
 *     summary: List all template menus
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Template menus list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/TemplateMenuResponseDto"
 */
r.get("/template-menus", authRequired, requireCoach, forward(BASE, "/internal/menu/template-menus"));

/**
 * @openapi
 * /api/template-menus/{id}:
 *   get:
 *     tags: [Template Menus]
 *     summary: Get template menu by ID
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
 *         description: Template menu retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TemplateMenuResponseDto"
 *       404:
 *         description: Template menu not found
 */
r.get("/template-menus/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/template-menus/:id"));
/**
 * @openapi
 * /api/template-menus:
 *   post:
 *     tags: [Template Menus]
 *     summary: Create a new template menu
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/TemplateMenuCreateRequestDto"
 *     responses:
 *       201:
 *         description: Template menu created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TemplateMenuResponseDto"
 */
r.post("/template-menus", authRequired, requireCoach, forward(BASE, "/internal/menu/template-menus"));

/**
 * @openapi
 * /api/template-menus/{id}:
 *   put:
 *     tags: [Template Menus]
 *     summary: Update template menu
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
 *             $ref: "#/components/schemas/TemplateMenuUpdateRequestDto"
 *     responses:
 *       200:
 *         description: Template menu updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/TemplateMenuResponseDto"
 *       404:
 *         description: Template menu not found
 */
r.put("/template-menus/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/template-menus/:id"));

/**
 * @openapi
 * /api/template-menus/{id}:
 *   delete:
 *     tags: [Template Menus]
 *     summary: Delete template menu
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
 *         description: Template menu deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *       404:
 *         description: Template menu not found
 */
r.delete("/template-menus/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/template-menus/:id"));

export default r;