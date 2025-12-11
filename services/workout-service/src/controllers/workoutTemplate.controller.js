const { listTemplates, getTemplateById } = require("../services/workoutTemplate.service");

/**
 * @openapi
 * /internal/workout/templates:
 *   get:
 *     tags:
 *       - Workout - Templates
 *     summary: List workout templates (internal)
 *     security:
 *       - internalToken: []
 *     responses:
 *       200:
 *         description: Workout template list
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Workout_WorkoutTemplateResponseDto'
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
 * @openapi
 * /internal/workout/templates/{id}:
 *   get:
 *     tags:
 *       - Workout - Templates
 *     summary: Get a workout template by ID (internal)
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
 *         description: Workout template detail
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Workout_WorkoutTemplateResponseDto'
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