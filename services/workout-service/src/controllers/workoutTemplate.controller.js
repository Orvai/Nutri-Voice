const { listTemplates, getTemplateById } = require("../services/workoutTemplate.service");

/**
 * INTERNAL ONLY
 * GET /internal/workout/templates
 */
const listTemplatesController = async (req, res, next) => {
  try {
    const result = await listTemplates(req.query);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

/**
 * INTERNAL ONLY
 * GET /internal/workout/templates/:id
 */
const getTemplateController = async (req, res, next) => {
  try {
    const result = await getTemplateById(req.params.id);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  listTemplates: listTemplatesController,
  getTemplate: getTemplateController,
};
