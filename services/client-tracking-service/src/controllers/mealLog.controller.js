const { z } = require('zod');
const { createMeal, listAllMeals } = require('../services/mealLog.service');
const { MealLogCreateDto, MealLogResponseDto } = require('../dto/mealLog.dto');

const ClientIdParamsDto = z.object({ clientId: z.string().min(1) }).strict();
const LogIdParamsDto = z.object({ logId: z.string().min(1) });


const createMealController = async (req, res, next) => {
  try {
    const payload = MealLogCreateDto.parse(req.body);
    const clientId = req.user.id;

    const data = await createMeal(clientId, payload);

    res.status(201).json({
      message: 'Meal logged',
      data: MealLogResponseDto.parse(data)
    });
  } catch (e) {
    next(e);
  }
};

const history = async (req, res, next) => {
  try {
    const { clientId } = ClientIdParamsDto.parse(req.params);
    const data = await listAllMeals(clientId);

    res.json({
      data: data.map((m) => MealLogResponseDto.parse(m))
    });
  } catch (e) {
    next(e);
  }
};


const updateMealController = async (req, res, next) => {
  try {
    const { logId } = LogIdParamsDto.parse(req.params);
    const payload = MealLogUpdateDto.parse(req.body);

    const data = await updateMeal(logId, payload);

    res.json({
      message: 'Meal updated',
      data: MealLogResponseDto.parse(data)
    });
  } catch (e) {
    next(e);
  }
};

module.exports = {
  createMeal,
  history,
  updateMeal: updateMealController
};

module.exports = { createMeal: createMealController, history };