const { Router } = require("express");
const { verifyInternalToken } = require("./middleware/verifyInternalToken");

const DaySelection = require("./controllers/daySelection.controller");
const MealLog = require("./controllers/mealLog.controller");
const WorkoutLog = require("./controllers/workoutLog.controller");
const WeightLog = require("./controllers/weightLog.controller");

const r = Router();

r.post("/internal/tracking/day-selection", verifyInternalToken, DaySelection.setDayType);
r.get("/internal/tracking/day-selection/today/:clientId", verifyInternalToken, DaySelection.getToday);

r.post("/internal/tracking/meal-log", verifyInternalToken, MealLog.createMeal);
r.get("/internal/tracking/meal-log/history/:clientId", verifyInternalToken, MealLog.history);

r.post("/internal/tracking/workout-log", verifyInternalToken, WorkoutLog.createWorkout);
r.get("/internal/tracking/workout-log/history/:clientId", verifyInternalToken, WorkoutLog.history);
r.put("/internal/tracking/workout-log/:logId", verifyInternalToken, WorkoutLog.updateWorkout);
r.patch("/internal/tracking/workout-log/exercise/:exerciseLogId", verifyInternalToken, WorkoutLog.updateExercise);

r.post("/internal/tracking/weight-log", verifyInternalToken, WeightLog.createWeight);
r.get("/internal/tracking/weight-log/history/:clientId", verifyInternalToken, WeightLog.history);

module.exports = r;
