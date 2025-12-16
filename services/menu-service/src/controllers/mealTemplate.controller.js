const {
  createMealTemplate,
  listMealTemplates,
  getMealTemplate,
  updateMealTemplate,
  deleteMealTemplate,
} = require("../services/mealTemplate.service");

const {
  MealTemplateCreateDto,
  MealTemplateUpdateDto,
  MealTemplateListQueryDto,
} = require("../dto/mealTemplate.dto");

/**
 * ============================
 * CREATE
 * ============================
 */
const createMealTemplateController = async (req, res, next) => {
  try {
    const parsed = MealTemplateCreateDto.parse(req.body);

    const { coachId, ...payload } = parsed;

    const result = await createMealTemplate(payload, coachId);

    res.status(201).json({ data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * ============================
 * LIST
 * ============================
 */
const listMealTemplatesController = async (req, res, next) => {
  try {
    const parsedQuery = MealTemplateListQueryDto.parse(req.query);

    const result = await listMealTemplates(parsedQuery);

    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * ============================
 * GET BY ID
 * ============================
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
 * ============================
 * UPDATE
 * ============================
 */
const updateMealTemplateController = async (req, res, next) => {
  try {
    const parsed = MealTemplateUpdateDto.parse(req.body);

    const result = await updateMealTemplate(req.params.id, parsed);

    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * ============================
 * DELETE
 * ============================
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
  updateMealTemplate: updateMealTemplateController,
  deleteMealTemplate: deleteMealTemplateController,
};
