const dayjs = require("dayjs");
const TrackingService = require("../tracking.service");

const getClientProgress = async (clientId, rangeDays) => {
  const since = dayjs().subtract(rangeDays, "day");

  const [weights, meals, workouts] = await Promise.all([
    TrackingService.getWeightHistory(clientId),
    TrackingService.getMealHistory(clientId),
    TrackingService.getWorkoutHistory(clientId)
  ]);

  /* ======================
     WEIGHT TREND
  ====================== */
  const weightLogs = weights.filter(w =>
    dayjs(w.date).isAfter(since)
  );

  const weightTrend = weightLogs.map(w => w.weightKg);
  const weightMonths = weightLogs.map(w =>
    dayjs(w.date).format("MMM")
  );

  /* ======================
     CALORIE DEVIATION
  ====================== */
  const mealsInRange = meals.filter(m =>
    dayjs(m.date).isAfter(since)
  );

  const dailyCalories = {};
  mealsInRange.forEach(m => {
    const d = dayjs(m.date).format("YYYY-MM-DD");
    dailyCalories[d] = (dailyCalories[d] || 0) + m.calories;
  });

  const calorieDates = Object.keys(dailyCalories);
  const avgCalories =
    Object.values(dailyCalories).reduce((a, b) => a + b, 0) /
    Math.max(calorieDates.length, 1);

  const caloriesDeviation = calorieDates.map(
    d => Math.round(dailyCalories[d] - avgCalories)
  );

  /* ======================
     WORKOUT PROGRESS
  ====================== */
  const workoutCountByMuscle = {};

  workouts
    .filter(w => dayjs(w.date).isAfter(since))
    .forEach(w => {
      w.exercises?.forEach(ex => {
        workoutCountByMuscle[ex.exerciseName] =
          (workoutCountByMuscle[ex.exerciseName] || 0) + 1;
      });
    });

  const workoutProgressMuscles = Object.keys(workoutCountByMuscle);
  const workoutProgressNow = Object.values(workoutCountByMuscle);

  /* ======================
     SUMMARY
  ====================== */
  const firstWeight = weightLogs[0]?.weightKg;
  const lastWeight = weightLogs.at(-1)?.weightKg;

  const summary = {
    weightChange:
      firstWeight && lastWeight
        ? `${(lastWeight - firstWeight).toFixed(1)} ק״ג`
        : "—"
  };

  /* ======================
     MEASUREMENTS TABLE
  ====================== */
  const measurements = weightLogs.map(w => ({
    date: dayjs(w.date).format("YYYY-MM-DD"),
    weight: `${w.weightKg} ק״ג`
  }));

  return {
    weightTrend,
    weightMonths,
    calorieDates,
    caloriesDeviation,
    workoutProgressMuscles,
    workoutProgressNow,
    summary,
    measurements
  };
};

module.exports = { getClientProgress };
