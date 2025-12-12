// src/controllers/workoutTemplate.controller.js
const {
  listTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = require("../services/workoutTemplate.service");

// GET /internal/workout/templates
const listTemplatesController = async (req, res, next) => {
  try {
    const result = await listTemplates(req.query);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

// GET /internal/workout/templates/:id
const getTemplateController = async (req, res, next) => {
  try {
    const result = await getTemplateById(req.params.id);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

// POST /internal/workout/templates
const createTemplateController = async (req, res, next) => {
  try {
    const result = await createTemplate(req.body, req.user.id);
    res.status(201).json({ data: result });
  } catch (e) {
    next(e);
  }
};

// PUT /internal/workout/templates/:id
const updateTemplateController = async (req, res, next) => {
  try {
    const result = await updateTemplate(
      req.params.id,
      req.body,
      req.user.id
    );
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

// DELETE /internal/workout/templates/:id
const deleteTemplateController = async (req, res, next) => {
  try {
    await deleteTemplate(req.params.id, req.user.id);
    res.json({ id: req.params.id });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  listTemplates: listTemplatesController,
  getTemplate: getTemplateController,
  createTemplate: createTemplateController,
  updateTemplate: updateTemplateController,
  deleteTemplate: deleteTemplateController,
};
