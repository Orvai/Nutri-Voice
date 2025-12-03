const {
  createMealTemplate,
  listMealTemplates,
  getMealTemplate,
  upsertMealTemplate,
  deleteMealTemplate,
} = require("../services/mealTemplate.service");

/**
 * INTERNAL ONLY
 * POST /internal/menu/templates
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
 * INTERNAL ONLY
 * GET /internal/menu/templates
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
 * INTERNAL ONLY
 * GET /internal/menu/templates/:id
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
 * INTERNAL ONLY
 * PUT /internal/menu/templates/:id
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
 * INTERNAL ONLY
 * DELETE /internal/menu/templates/:id
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
