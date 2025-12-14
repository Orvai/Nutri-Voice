// src/controllers/workoutTemplate.controller.js
const {
  listTemplates,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
} = require("../services/workoutTemplate.service");
const {
  WorkoutTemplateIdParamDto,
  WorkoutTemplateQueryDto,
  WorkoutTemplateCreateDto,
  WorkoutTemplateUpdateDto,
} = require("../dto/workoutTemplate.dto");

// GET /internal/workout/templates
const listTemplatesController = async (req, res, next) => {
  try {
    const query = WorkoutTemplateQueryDto.parse(req.query);
    const result = await listTemplates(query);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

// GET /internal/workout/templates/:id
const getTemplateController = async (req, res, next) => {
  try {
    const { id } = WorkoutTemplateIdParamDto.parse(req.params);
    const result = await getTemplateById(id);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

// POST /internal/workout/templates
const createTemplateController = async (req, res, next) => {
  try {
    const payload = WorkoutTemplateCreateDto.parse(req.body);
    const result = await createTemplate(payload, req.user?.id);
    res.status(201).json({ data: result });
  } catch (e) {
    next(e);
  }
};

// PUT /internal/workout/templates/:id
const updateTemplateController = async (req, res, next) => {
  try {
    const { id } = WorkoutTemplateIdParamDto.parse(req.params);
    const payload = WorkoutTemplateUpdateDto.parse(req.body);
    const result = await updateTemplate(id, payload, req.user?.id);
    res.json({ data: result });
  } catch (e) {
    next(e);
  }
};

// DELETE /internal/workout/templates/:id
const deleteTemplateController = async (req, res, next) => {
  try {
    const { id } = WorkoutTemplateIdParamDto.parse(req.params);
    await deleteTemplate(id, req.user?.id);
    res.json({ id });
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