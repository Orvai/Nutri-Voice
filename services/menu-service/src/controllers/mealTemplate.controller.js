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
   *       - MealTemplates
   *     summary: Create a new meal template
   *     description: Creates a new reusable meal template with its items.
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
   *               $ref: '#/components/schemas/MealTemplateResponseDto'
   */
  const createMealTemplateController = async (req, res, next) => {
    try {
      const result = await createMealTemplate(req.body, req.user.userId);
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
   *       - MealTemplates
   *     summary: List meal templates
   *     description: Lists all meal templates, optionally filtered by kind or coachId.
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
   *       - MealTemplates
   *     summary: Get a meal template by ID
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
   *       - MealTemplates
   *     summary: Upsert a meal template
   *     description: Updates an existing meal template or creates one if it does not exist.
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
   *         description: Meal template upserted successfully
   */
  const upsertMealTemplateController = async (req, res, next) => {
    try {
      const result = await upsertMealTemplate(req.params.id, req.body);
      res.json({
        message: "Meal template upserted successfully",
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
   *       - MealTemplates
   *     summary: Delete a meal template
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
  