const { prisma } = require('../db/prisma');
const { getTodayDayType } = require('./daySelection.service');
const { getClientMenus } = require('../clients/menu.client');
const { getStartOfDay, getEndOfDay } = require('../utils/date.utils');

/* ======================================================
   Internal fetchers
====================================================== */

const getMealsForToday = (clientId) => {
  const today = new Date();
  return prisma.mealLog.findMany({
    where: {
      clientId,
      date: {
        gte: getStartOfDay(today),
        lte: getEndOfDay(today),
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
        gte: getStartOfDay(today),
        lte: getEndOfDay(today),
      },
    },
    include: {
      exercises: true, // תואם ל-WorkoutLog schema
    },
    orderBy: [{ date: 'asc' }, { loggedAt: 'asc' }],
  });
};

const getTodayMetrics = (clientId) => {
  const today = new Date();
  return prisma.metricsLog.findFirst({
    where: {
      clientId,
      date: {
        gte: getStartOfDay(today),
        lte: getEndOfDay(today),
      },
    },
  });
};

const getTodayWeight = (clientId) => {
  const today = new Date();
  return prisma.weightLog.findFirst({
    where: {
      clientId,
      date: {
        gte: getStartOfDay(today),
        lte: getEndOfDay(today),
      },
    },
    orderBy: { date: 'desc' },
  });
};

/* ======================================================
   Daily State
====================================================== */

const getDailyState = async (clientId) => {
  const daySelection = await getTodayDayType(clientId);
  const dayType = daySelection?.dayType ?? null;

  const meals = await getMealsForToday(clientId);
  const workouts = await getWorkoutsForToday(clientId);
  const weight = await getTodayWeight(clientId);
  const metrics = await getTodayMetrics(clientId);

  const consumedCalories = meals.reduce(
    (sum, meal) => sum + (meal.calories || 0),
    0
  );

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

  return {
    dayType,
    calorieTargets,
    activeCaloriesAllowed,
    consumedCalories,
    remainingCalories,
    meals,
    workouts,
    weight,
    metrics,
  };
};
/* ======================================================
   Range State (NEW)
====================================================== */
const getRangeState = async (clientId, startDate, endDate) => {
  const start = getStartOfDay(new Date(startDate));
  const end = getEndOfDay(new Date(endDate));

  const [daySelections, meals, workouts, weights, metrics, clientMenus] = await Promise.all([
    prisma.daySelection.findMany({ where: { clientId, date: { gte: start, lte: end } } }),
    prisma.mealLog.findMany({ where: { clientId, date: { gte: start, lte: end } } }),
    prisma.workoutLog.findMany({ 
      where: { clientId, date: { gte: start, lte: end } }, 
      include: { exercises: true } 
    }),
    prisma.weightLog.findMany({ where: { clientId, date: { gte: start, lte: end } } }),
    prisma.metricsLog.findMany({ where: { clientId, date: { gte: start, lte: end } } }),
    getClientMenus(clientId)
  ]);

  const trainingMenu = clientMenus.find(m => m.type === 'TRAINING' && m.isActive);
  const restMenu = clientMenus.find(m => m.type === 'REST' && m.isActive);
  const calorieTargets = {
    trainingDay: trainingMenu?.totalCalories ?? null,
    restDay: restMenu?.totalCalories ?? null,
  };

  const results = [];
  const dateCursor = new Date(start);

  while (dateCursor <= end) {
    const dStr = dateCursor.toISOString().split('T')[0];

    const dayMeals = meals.filter(m => m.date.toISOString().startsWith(dStr));
    const dayWorkouts = workouts.filter(w => w.date.toISOString().startsWith(dStr));
    const daySelection = daySelections.find(s => s.date.toISOString().startsWith(dStr));
    const dayWeight = weights.find(w => w.date.toISOString().startsWith(dStr));
    const dayMetrics = metrics.find(m => m.date.toISOString().startsWith(dStr));

    const dayType = daySelection?.dayType ?? null;
    const consumedCalories = dayMeals.reduce((sum, m) => sum + (m.calories || 0), 0);

    let activeAllowed = null;
    if (dayType === 'TRAINING') activeAllowed = calorieTargets.trainingDay;
    else if (dayType === 'REST') activeAllowed = calorieTargets.restDay;

    results.push({
      data: {
        dayType,
        calorieTargets,
        activeCaloriesAllowed: activeAllowed,
        consumedCalories,
        remainingCalories: activeAllowed !== null ? activeAllowed - consumedCalories : null,
        meals: dayMeals,
        workouts: dayWorkouts,
        weight: dayWeight || null,
        metrics: dayMetrics || null,
      }
    });

    dateCursor.setDate(dateCursor.getDate() + 1);
  }

  return results;
};
module.exports = { 
  getDailyState,
  getRangeState 
};