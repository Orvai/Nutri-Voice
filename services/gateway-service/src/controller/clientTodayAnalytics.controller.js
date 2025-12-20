const dayjs = require("dayjs");
const axios = require("axios");

const TRACKING_SERVICE_URL = process.env.TRACKING_SERVICE_URL;
const MENU_SERVICE_URL = process.env.MENU_SERVICE_URL;
const INTERNAL_TOKEN = process.env.INTERNAL_SERVICE_TOKEN;

const isToday = (d) => dayjs(d).isSame(dayjs(), "day");

const internalHeaders = {
  "x-internal-token": INTERNAL_TOKEN
};

module.exports.getClientTodayAnalytics = async (req, res, next) => {
  try {
    const { clientId } = req.params;

    /* =========================
       FETCH RAW DATA
    ========================= */
    const [
      mealsRes,
      daySelectionRes,
      workoutsRes,
      weightRes,
      menusRes
    ] = await Promise.all([
      axios.get(
        `${TRACKING_SERVICE_URL}/internal/tracking/meal-log/history/${clientId}`,
        { headers: internalHeaders }
      ),
      axios.get(
        `${TRACKING_SERVICE_URL}/internal/tracking/day-selection/today/${clientId}`,
        { headers: internalHeaders }
      ),
      axios.get(
        `${TRACKING_SERVICE_URL}/internal/tracking/workout-log/history/${clientId}`,
        { headers: internalHeaders }
      ),
      axios.get(
        `${TRACKING_SERVICE_URL}/internal/tracking/weight-log/history/${clientId}`,
        { headers: internalHeaders }
      ),
      axios.get(
        `${MENU_SERVICE_URL}/internal/menu/meal-templates`,
        { headers: internalHeaders }
      )
    ]);

    /* =========================
       MEALS + CALORIES
    ========================= */
    const mealsToday = mealsRes.data.filter(m =>
      isToday(m.date)
    );

    const caloriesConsumed = mealsToday.reduce((s, m) => s + m.calories, 0);
    const proteinEaten = mealsToday.reduce((s, m) => s + m.protein, 0);
    const carbsEaten = mealsToday.reduce((s, m) => s + m.carbs, 0);
    const fatEaten = mealsToday.reduce((s, m) => s + m.fat, 0);

    const meals = mealsToday.map(m => ({
      id: m.id,
      title: m.description || "ארוחה",
      time: dayjs(m.loggedAt || m.date).format("HH:mm"),
      calories: m.calories,
      protein: m.protein,
      fat: m.fat,
      fromPlan: Boolean(m.matchedMenuItemId),
      description: m.description
    }));

    /* =========================
       DAY TYPE → TARGET CALORIES
    ========================= */
    let targetCalories = 0;

    const daySelection = daySelectionRes.data;
    if (daySelection) {
      const menuName =
        daySelection.dayType === "TRAINING"
          ? "תפריט יום אימון"
          : "תפריט יום מנוחה";

      const matchedMenu = menusRes.data.data.find(
        m => m.name === menuName
      );

      if (matchedMenu) {
        targetCalories = matchedMenu.totalCalories;
      }
    }

    /* =========================
       WORKOUT
    ========================= */
    const workoutToday = workoutsRes.data.find(w =>
      isToday(w.date)
    );

    const workout = workoutToday
      ? {
          done: true,
          title: workoutToday.workoutType,
          time: dayjs(workoutToday.date).format("HH:mm")
        }
      : { done: false };

    /* =========================
       QUICK STATS – WEIGHT
    ========================= */
    const lastWeight = weightRes.data.at(-1);

    const quickStats = lastWeight
      ? [
          {
            icon: "scale",
            label: "משקל",
            value: `${lastWeight.weightKg} ק״ג`
          }
        ]
      : [];

    /* =========================
       RESPONSE
    ========================= */
    return res.json({
      calories: {
        consumed: caloriesConsumed,
        target: targetCalories,
        carbs: { eaten: carbsEaten, target: 0 },
        protein: { eaten: proteinEaten, target: 0 },
        fat: { eaten: fatEaten, target: 0 },
        lastUpdate: new Date().toISOString()
      },
      meals,
      workout,
      quickStats
    });
  } catch (err) {
    next(err);
  }
};
