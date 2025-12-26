const { prisma } = require('../db/prisma');
const { MealLogCreateDto } = require('../dto/mealLog.dto');
const { getStartOfDay, getEndOfDay, getDateDaysAgo } = require('../utils/date.utils');

const createMeal = async (clientId, payload) => {
  const data = MealLogCreateDto.parse(payload);
  const logDate = data.date ? new Date(data.date) : new Date();

  return prisma.mealLog.create({
    data: {
      clientId,
      dayType: data.dayType,
      calories: data.calories,
      protein: data.protein,
      carbs: data.carbs,
      fat: data.fat,
      description: data.description,
      matchedMenuItemId: data.matchedMenuItemId,
      date: logDate
    }
  });
};

const listAllMeals = (clientId) => {
  const start = getStartOfDay(getDateDaysAgo(30)); 
  const end = getEndOfDay(new Date());

  return prisma.mealLog.findMany({
    where: {
      clientId,
      date: {
        gte: start,
        lte: end
      }
    },
    orderBy: [{ date: 'asc' }, { loggedAt: 'asc' }]
  });
};

const updateMeal = async (logId, payload) => {
  const data = MealLogUpdateDto.parse(payload);

  return prisma.mealLog.update({
    where: { id: logId },
    data
  });
};

module.exports = {
  createMeal,
  listAllMeals,updateMeal
};
