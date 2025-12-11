const { createMeal, listAllMeals } = require('../services/mealLog.service');
const { MealLogCreateDto, MealLogResponseDto } = require('../dto/mealLog.dto');

/**
 * @openapi
 * /api/tracking/meal-log:
 *   post:
 *     tags:
 *       - Tracking
 *     summary: Log a meal for a client
 *     description: Authenticated client records a meal including calories and macros.
 *     security:
 *       - internalToken: []
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
    const payload = MealLogCreateDto.parse(req.body);
    const clientId = req.user.id;

    const data = await createMeal({ ...payload, clientId });

    res.status(201).json({
      message: 'Meal logged',
      data: MealLogResponseDto.parse(data)
    });
  } catch (e) {
    next(e);
  }
};

/**
 * @openapi
 * /api/tracking/meal-log/history/{clientId}:
 *   get:
 *     tags:
 *       - Tracking
 *     summary: Get meal history for a client
 *     security:
 *       - internalToken: []
 *     parameters:
 *       - in: path
 *         name: clientId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Full meal history
 */
const history = async (req, res, next) => {
  try {
    const { clientId } = req.params;
    const data = await listAllMeals(clientId);

    res.json({
      data: data.map((m) => MealLogResponseDto.parse(m))
    });
  } catch (e) {
    next(e);
  }
};

module.exports = { createMeal: createMealController, history };
