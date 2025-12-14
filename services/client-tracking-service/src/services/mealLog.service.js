const { prisma } = require('../db/prisma');
const { MealLogCreateDto } = require('../dto/mealLog.dto');

const startOfDay = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (d) => {
  const date = new Date(d);
  date.setHours(23, 59, 59, 999);
  return date;
};

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
  const start = new Date(1970, 0, 1);
  const end = new Date();

  return prisma.mealLog.findMany({
    where: {
      clientId,
      date: {
        gte: startOfDay(start),
        lte: endOfDay(end)
      }
    },
    orderBy: [{ date: 'asc' }, { loggedAt: 'asc' }]
  });
};

module.exports = {
  createMeal,
  listAllMeals
};
