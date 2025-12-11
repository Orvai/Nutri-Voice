const {
  createMealTemplate,
  listMealTemplates,
  getMealTemplate,
  updateMealTemplate,
  deleteMealTemplate,
} = require("../services/mealTemplate.service");

/**
 * @openapi
 * /internal/menu/templates:
 *   post:
 *     tags:
 *       - Menu - Meal Templates
 *     summary: Create a meal template (internal)
 *     security:
 *       - internalToken: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Menu_MealTemplateCreateDto'
 *     responses:
 *       201:
 *         description: Meal template created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu_MealTemplateResponseDto'
 */
const createMealTemplateController = async (req, res, next) => {
  try {
    const { coachId, ...payload } = req.body;
    const result = await createMealTemplate(payload, coachId);

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
 * /internal/menu/templates:
 *   get:
 *     tags:
 *       - Menu - Meal Templates
 *     summary: List meal templates (internal)
 *     security:
 *       - internalToken: []
 *     responses:
 *       200:
 *         description: Meal template list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Menu_MealTemplateResponseDto'
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
 * /internal/menu/templates/{id}:
 *   get:
 *     tags:
 *       - Menu - Meal Templates
 *     summary: Get a meal template by ID (internal)
 *     security:
 *       - internalToken: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Meal template detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu_MealTemplateResponseDto'
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
 * /internal/menu/templates/{id}:
 *   put:
 *     tags:
 *       - Menu - Meal Templates
 *     summary: Create or update a meal template (internal)
 *     security:
 *       - internalToken: []
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
 *             $ref: '#/components/schemas/Menu_MealTemplateUpsertDto'
 *     responses:
 *       200:
 *         description: Meal template saved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Menu_MealTemplateResponseDto'
 */
const upsertMealTemplateController = async (req, res, next) => {
  try {
    const result = await updateMealTemplate(req.params.id, req.body);
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
 * /internal/menu/templates/{id}:
 *   delete:
 *     tags:
 *       - Menu - Meal Templates
 *     summary: Delete a meal template (internal)
 *     security:
 *       - internalToken: []
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
const deleteMealTemplateController = async (req, res, next) => {
  try {
    await deleteMealTemplate(req.params.id);
    res.json({ message: "Meal template deleted successfully" });
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