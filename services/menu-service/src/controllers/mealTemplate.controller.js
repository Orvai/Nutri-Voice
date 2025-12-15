const {
    createMealTemplate,
    listMealTemplates,
    getMealTemplate,
    updateMealTemplate,
    deleteMealTemplate,
  } = require("../services/mealTemplate.service");
  
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
  
  const getMealTemplateController = async (req, res, next) => {
    try {
      const result = await getMealTemplate(req.params.id);
      res.json({ data: result });
    } catch (e) {
      next(e);
    }
  };
  
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