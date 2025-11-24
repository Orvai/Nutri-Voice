// src/controllers/workoutTemplate.controller.js
const { listTemplates, getTemplateById } = require("../services/workoutTemplate.service");

/**
 * @openapi
 * /api/workout/templates:
 *   get:
 *     tags:
 *       - WorkoutTemplates
 *     summary: List workout templates
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: gender
 *         schema:
 *           type: string
 *           enum: [MALE, FEMALE]
 *       - in: query
 *         name: level
 *         schema:
 *           type: integer
 *       - in: query
 *         name: bodyType
 *         schema:
 *           type: string
 *           enum: [ECTO, ENDO]
 *       - in: query
 *         name: workoutType
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of templates
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/WorkoutTemplateResponseDto'
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
 * /api/workout/templates/{id}:
 *   get:
 *     tags:
 *       - WorkoutTemplates
 *     summary: Get workout template by id
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
 *         description: Template details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/WorkoutTemplateResponseDto'
 *       404:
 *         description: Not found
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