const dayjs = require("dayjs");
const { isToday } = require("../../common/date.utils");

const TrackingService = require("../tracking.service");
const MenuService = require("../menu.service");

const getClientToday = async (clientId) => {
  const [
    meals,
    workouts,
    weights,
    daySelection,
    menus
  ] = await Promise.all([
    TrackingService.getMealHistory(clientId),
    TrackingService.getWorkoutHistory(clientId),
    TrackingService.getWeightHistory(clientId),
    TrackingService.getTodayDaySelection(clientId),
    MenuService.getMealTemplates()
  ]);

  /* ======================
     MEALS
  ====================== */
  const mealsToday = meals.filter(m => isToday(m.date));

  const caloriesConsumed = mealsToday.reduce((s, m) => s + m.calories, 0);
  const proteinEaten = mealsToday.reduce((s, m) => s + m.protein, 0);
  const carbsEaten = mealsToday.reduce((s, m) => s + m.carbs, 0);
  const fatEaten = mealsToday.reduce((s, m) => s + m.fat, 0);

  const mealsUi = mealsToday.map(m => ({
    id: m.id,
    title: m.description || "ארוחה",
    time: dayjs(m.loggedAt || m.date).format("HH:mm"),
    calories: m.calories,
    protein: m.protein,
    fat: m.fat,
    fromPlan: Boolean(m.matchedMenuItemId),
    description: m.description
  }));

  /* ======================
     TARGET CALORIES
  ====================== */
  let targetCalories = 0;

  if (daySelection) {
    const menuName =
      daySelection.dayType === "TRAINING"
        ? "תפריט יום אימון"
        : "תפריט יום מנוחה";

    const matchedMenu = menus.find(m => m.name === menuName);
    if (matchedMenu) targetCalories = matchedMenu.totalCalories;
  }

  /* ======================
     WORKOUT
  ====================== */
  const workoutToday = workouts.find(w => isToday(w.date));
  const workout = workoutToday
    ? {
        done: true,
        title: workoutToday.workoutType,
        time: dayjs(workoutToday.date).format("HH:mm")
      }
    : { done: false };

  /* ======================
     QUICK STATS
  ====================== */
  const lastWeight = weights.at(-1);
  const quickStats = lastWeight
    ? [{ icon: "scale", label: "משקל", value: `${lastWeight.weightKg} ק״ג` }]
    : [];

  return {
    calories: {
      consumed: caloriesConsumed,
      target: targetCalories,
      carbs: { eaten: carbsEaten, target: 0 },
      protein: { eaten: proteinEaten, target: 0 },
      fat: { eaten: fatEaten, target: 0 },
      lastUpdate: new Date().toISOString()
    },
    meals: mealsUi,
    workout,
    quickStats
  };
};

module.exports = { getClientToday };
