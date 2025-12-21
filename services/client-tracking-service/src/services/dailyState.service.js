const { prisma } = require('../db/prisma');
const { getTodayDayType } = require('./daySelection.service');
const { getClientMenus } = require('../clients/menu.client');

/* ======================================================
   Date helpers
====================================================== */

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

/* ======================================================
   Internal fetchers
====================================================== */

const getMealsForToday = (clientId) => {
  const today = new Date();
  return prisma.mealLog.findMany({
    where: {
      clientId,
      date: {
        gte: startOfDay(today),
        lte: endOfDay(today),
      },
    },
    orderBy: [{ date: 'asc' }, { loggedAt: 'asc' }],
  });
};

const getWorkoutsForToday = (clientId) => {
  const today = new Date();
  return prisma.workoutLog.findMany({
    where: {
      clientId,
      date: {
        gte: startOfDay(today),
        lte: endOfDay(today),
      },
    },
    include: {
      exercises: true,
    },
    orderBy: [{ date: 'asc' }, { loggedAt: 'asc' }],
  });
};

const getTodayWeight = (clientId) => {
  const today = new Date();
  return prisma.weightLog.findFirst({
    where: {
      clientId,
      date: {
        gte: startOfDay(today),
        lte: endOfDay(today),
      },
    },
    orderBy: { date: 'desc' },
  });
};

/* ======================================================
   Daily State
====================================================== */

const getDailyState = async (clientId) => {
  // 1️⃣ Day selection
  const daySelection = await getTodayDayType(clientId);
  const dayType = daySelection?.dayType ?? null;

  // 2️⃣ Logs
  const meals = await getMealsForToday(clientId);
  const workouts = await getWorkoutsForToday(clientId);
  const weight = await getTodayWeight(clientId);

  const consumedCalories = meals.reduce(
    (sum, meal) => sum + (meal.calories || 0),
    0
  );

  // 3️⃣ Client menus (SOURCE OF TRUTH)
  const clientMenus = await getClientMenus(clientId);

  const trainingMenu = clientMenus.find(
    (m) => m.type === 'TRAINING' && m.isActive
  );

  const restMenu = clientMenus.find(
    (m) => m.type === 'REST' && m.isActive
  );

  const calorieTargets = {
    trainingDay: trainingMenu?.totalCalories ?? null,
    restDay: restMenu?.totalCalories ?? null,
  };

  // 4️⃣ Active calories (only if dayType selected)
  let activeCaloriesAllowed = null;
  let remainingCalories = null;

  if (dayType === 'TRAINING') {
    activeCaloriesAllowed = calorieTargets.trainingDay;
  } else if (dayType === 'REST') {
    activeCaloriesAllowed = calorieTargets.restDay;
  }

  if (activeCaloriesAllowed !== null) {
    remainingCalories = activeCaloriesAllowed - consumedCalories;
  }

  // 5️⃣ Final snapshot
  return {
    dayType,
    calorieTargets,
    activeCaloriesAllowed,
    consumedCalories,
    remainingCalories,
    meals,
    workouts,
    weight,
  };
};

module.exports = { getDailyState };
