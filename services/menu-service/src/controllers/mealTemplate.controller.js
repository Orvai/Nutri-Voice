// src/controllers/mealTemplate.controller.js

const {
  createMealTemplate,
  listMealTemplates,
  getMealTemplate,
  upsertMealTemplate,
  deleteMealTemplate,
} = require("../services/mealTemplate.service");

/**
 * @openapi
 * /api/menu/templates:
 *   post:
 *     tags:
 *       - Meal Templates
 *     summary: Create a new meal template
 *     description: Creates a reusable meal template with its items.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MealTemplateCreateRequestDto'
 *     responses:
 *       201:
 *         description: Meal template created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/MealTemplateResponseDto'
 */
const createMealTemplateController = async (req, res, next) => {
  try {
    const result = await createMealTemplate(req.body, req.auth.userId);
    res.status(201).json({
      message: "Meal template created successfully",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /api/menu/templates:
 *   get:
 *     tags:
 *       - Meal Templates
 *     summary: List meal templates
 *     description: Lists meal templates, optionally filtered by kind or coachId.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: kind
 *         schema:
 *           type: string
 *       - in: query
 *         name: coachId
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of meal templates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/MealTemplateResponseDto'
 */
const listMealTemplatesController = async (req, res, next) => {
  try {
    const result = await listMealTemplates(req.query);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /api/menu/templates/{id}:
 *   get:
 *     tags:
 *       - Meal Templates
 *     summary: Get a meal template by ID
 *     description: Retrieves a single meal template along with its items.
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
 *         description: Meal template data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/MealTemplateResponseDto'
 *       404:
 *         description: Not found
 */
const getMealTemplateController = async (req, res, next) => {
  try {
    const result = await getMealTemplate(req.params.id);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /api/menu/templates/{id}:
 *   put:
 *     tags:
 *       - Meal Templates
 *     summary: Update a meal template (add, update or delete template items)
 *     description: Fully updates a meal template, including updating its fields and managing template items using itemsToAdd, itemsToUpdate, and itemsToDelete.
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
 *             $ref: '#/components/schemas/MealTemplateUpdateRequestDto'
 *     responses:
 *       200:
 *         description: Meal template updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/MealTemplateResponseDto'
 */
const upsertMealTemplateController = async (req, res, next) => {
  try {
    const result = await upsertMealTemplate(req.params.id, req.body);
    res.json({
      message: "Meal template updated successfully",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /api/menu/templates/{id}:
 *   delete:
 *     tags:
 *       - Meal Templates
 *     summary: Delete a meal template
 *     description: Deletes a meal template by ID.
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
 *         description: Meal template deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
const deleteMealTemplateController = async (req, res, next) => {
  try {
    await deleteMealTemplate(req.params.id);
    res.json({
      message: "Meal template deleted successfully",
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createMealTemplate: createMealTemplateController,
  listMealTemplates: listMealTemplatesController,
  getMealTemplate: getMealTemplateController,
  upsertMealTemplate: upsertMealTemplateController,
  deleteMealTemplate: deleteMealTemplateController,
};
