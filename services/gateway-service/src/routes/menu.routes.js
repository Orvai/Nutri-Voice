/**
 * @openapi
 * tags:
 *   - name: Food
 *   - name: Meal Templates
 *   - name: Template Menus
 *   - name: Client Menus
 *   - name: Vitamins
 */

import { Router } from "express";
import { attachUser } from "../middleware/attachUser.js";
import { authRequired } from "../middleware/authRequired.js";
import { requireOwnership } from "../middleware/requireOwnership.js";
import { requireCoach } from "../middleware/requireRole.js";
import { forward } from "../utils/forward.js";

const r = Router();
const BASE = process.env.MENU_SERVICE_URL;

r.use(attachUser);


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



/* ======================================================
   CLIENT MENUS
====================================================== */

/**
 * @openapi
 * /api/client-menus:
 *   get:
 *     tags: [Client Menus]
 *     summary: List client menus (coach or client)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Client menus list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/ClientMenuResponseDto"
 */
r.get("/client-menus", authRequired, forward(BASE, "/internal/menu/client-menus"));

/**
 * @openapi
 * /api/client-menus/{id}:
 *   get:
 *     tags: [Client Menus]
 *     summary: Get client menu by ID
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
 *         description: Client menu retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ClientMenuResponseDto"
 *       404:
 *         description: Client menu not found
 */
r.get("/client-menus/:id",authRequired,requireOwnership,forward(BASE, "/internal/menu/client-menus/:id"));

/**
 * @openapi
 * /api/client-menus:
 *   post:
 *     tags: [Client Menus]
 *     summary: Create a new client menu
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ClientMenuCreateRequestDto"
 *     responses:
 *       201:
 *         description: Client menu created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ClientMenuResponseDto"
 */
r.post("/client-menus",authRequired,requireCoach,forward(BASE, "/internal/menu/client-menus"));

/**
 * @openapi
 * /api/client-menus/{id}:
 *   put:
 *     tags: [Client Menus]
 *     summary: Update client menu
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
 *             $ref: "#/components/schemas/ClientMenuUpdateRequestDto"
 *     responses:
 *       200:
 *         description: Client menu updated
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ClientMenuResponseDto"
 *       404:
 *         description: Client menu not found
 */
r.put("/client-menus/:id",authRequired,requireCoach,forward(BASE, "/internal/menu/client-menus/:id"));

/**
 * @openapi
 * /api/client-menus/{id}:
 *   delete:
 *     tags: [Client Menus]
 *     summary: Deactivate client menu
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
 *         description: Client menu deactivated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 */
r.delete("/client-menus/:id",authRequired,requireCoach,forward(BASE, "/internal/menu/client-menus/:id"));

/**
 * @openapi
 * /api/client-menus/from-template:
 *   post:
 *     tags: [Client Menus]
 *     summary: Create client menu from template
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ClientMenuCreateFromTemplateRequestDto"
 *     responses:
 *       201:
 *         description: Client menu created from template
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/ClientMenuResponseDto"
 */
r.post("/client-menus/from-template",authRequired,requireCoach,
  (req, res, next) => {
    const { clientId, templateMenuId } = req.body ?? {};
    if (!clientId) return res.status(400).json({ message: "clientId is required" });
    if (!templateMenuId) return res.status(400).json({ message: "templateMenuId is required" });
    req.body = { ...req.body, coachId: req.user.id };
    return forward(BASE, "/internal/menu/client-menus/from-template")(req, res, next);
  }
);



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
