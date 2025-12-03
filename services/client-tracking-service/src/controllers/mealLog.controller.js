const {
  createMeal,
  listAllMeals
} = require('../services/mealLog.service');

const { MealLogCreateDto } = require('../dto/mealLog.dto');


/**
 * @openapi
 * /api/tracking/meal-log:
 *   post:
 *     tags:
 *       - Tracking
 *     summary: Log a meal for a client
 *     description: Saves a meal entry including macros and optional description.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MealLogCreateDto'
 *     responses:
 *       201:
 *         description: Meal logged successfully
 */
const createMealController = async (req, res, next) => {
  try {
    const { clientId, ...payload } = MealLogCreateDto.parse(req.body);
    const data = await createMeal({ ...payload, clientId });
    res.status(201).json({ message: 'Meal logged', data });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /api/tracking/meal-log/history:
 *   get:
 *     tags:
 *       - Tracking
 *     summary: Get full meal history for a client
 *     description: Returns all meals for the client (no date limits).
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: clientId
 *         schema:
 *           type: string
 *         required: false
 *     responses:
 *       200:
 *         description: Full meal history
 */
const history = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const data = await listAllMeals(clientId);
    res.json({ data });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createMeal: createMealController,
  history
};
