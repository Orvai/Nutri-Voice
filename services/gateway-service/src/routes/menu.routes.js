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
 */
r.get("/food", authRequired, forward(BASE, "/internal/menu/food"));

/**
 * @openapi
 * /api/food/search:
 *   get:
 *     tags: [Food]
 *     summary: Search food items
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Search results
 */
r.get("/food/search", authRequired, forward(BASE, "/internal/menu/food/search"));

/**
 * @openapi
 * /api/food/by-category:
 *   get:
 *     tags: [Food]
 *     summary: Get food categorized
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Categorized food list
 */
r.get("/food/by-category", authRequired, forward(BASE, "/internal/menu/food/by-category"));

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
 */
r.delete("/food/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/food/:id"));



/* ======================================================
   MEAL TEMPLATES
====================================================== */

/**
 * @openapi
 * /api/templates:
 *   get:
 *     tags: [Meal Templates]
 *     summary: Get all meal templates
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of templates
 */
r.get("/templates", authRequired, requireCoach, forward(BASE, "/internal/menu/templates"));

/**
 * @openapi
 * /api/templates/{id}:
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
 *         description: Template retrieved
 */
r.get("/templates/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/templates/:id"));

/**
 * @openapi
 * /api/templates:
 *   post:
 *     tags: [Meal Templates]
 *     summary: Create meal template
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
 *         description: Template created
 */
r.post("/templates", authRequired, requireCoach, forward(BASE, "/internal/menu/templates"));

/**
 * @openapi
 * /api/templates/{id}:
 *   put:
 *     tags: [Meal Templates]
 *     summary: Update meal template
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *     responses:
 *       200:
 *         description: Template updated
 */
r.put("/templates/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/templates/:id"));

/**
 * @openapi
 * /api/templates/{id}:
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
 *         description: Template deleted
 */
r.delete("/templates/:id", authRequired, requireCoach, forward(BASE, "/internal/menu/templates/:id"));



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
 *     responses:
 *       200:
 *         description: Template menu updated
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
 */
r.get("/client-menus", authRequired, forward(BASE, "/internal/menu/client-menus"));

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
 *         schema: { type: string }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: "#/components/schemas/ClientMenuUpdateRequestDto"
 *     responses:
 *       200:
 *         description: Client menu updated
 */
r.get(
  "/client-menus/:id",
  authRequired,
  requireOwnership,
  forward(BASE, "/internal/menu/client-menus/:id")
);

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
 */
r.post(
  "/client-menus",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/menu/client-menus")
);

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
 *       required: false
 *     responses:
 *       200:
 *         description: Client menu updated
 */
r.put(
  "/client-menus/:id",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/menu/client-menus/:id")
);

/**
 * @openapi
 * /api/client-menus/{id}:
 *   delete:
 *     tags: [Client Menus]
 *     summary: Delete client menu
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
 *         description: Client menu deleted
 */
r.delete(
  "/client-menus/:id",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/menu/client-menus/:id")
);

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
 */
r.post(
  "/client-menus/from-template",
  authRequired,
  requireCoach,
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
 */
r.post("/vitamins", authRequired, requireCoach, forward(BASE, "/internal/menu/vitamins"));

export default r;
