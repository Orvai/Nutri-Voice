const { Router } = require("express");
const  verifyInternalToken  = require("./middleware/verifyInternalToken");

const DaySelection = require("./controllers/daySelection.controller");
const MealLog = require("./controllers/mealLog.controller");
const WorkoutLog = require("./controllers/workoutLog.controller");
const WeightLog = require("./controllers/weightLog.controller");
const  DailyState  = require('./controllers/dailyState.controller');



const r = Router();
/* ======================================================
   DAY SELECTION
====================================================== */
r.post("/internal/tracking/day-selection", verifyInternalToken, DaySelection.setDayType);
r.get("/internal/tracking/day-selection/today/:clientId", verifyInternalToken, DaySelection.getToday);

/* ======================================================
   MEAL LOG
====================================================== */
r.post("/internal/tracking/meal-log", verifyInternalToken, MealLog.createMeal);
r.get("/internal/tracking/meal-log/history/:clientId", verifyInternalToken, MealLog.history);
r.put("/internal/tracking/meal-log/:logId",verifyInternalToken,MealLog.updateMeal);
/* ======================================================
   WORKOUT LOG
====================================================== */
r.post("/internal/tracking/workout-log", verifyInternalToken, WorkoutLog.createWorkout);
r.get("/internal/tracking/workout-log/history/:clientId", verifyInternalToken, WorkoutLog.history);
r.put("/internal/tracking/workout-log/:logId", verifyInternalToken, WorkoutLog.updateWorkout);
r.patch("/internal/tracking/workout-log/exercise/:exerciseLogId", verifyInternalToken, WorkoutLog.updateExercise);
/* ======================================================
   WEIGHT LOG
====================================================== */
r.post("/internal/tracking/weight-log", verifyInternalToken, WeightLog.createWeight);
r.get("/internal/tracking/weight-log/history/:clientId", verifyInternalToken, WeightLog.history);
r.put("/internal/tracking/weight-log/:logId",verifyInternalToken, WeightLog.updateWeight);
/* ======================================================
   DAILY STATE
====================================================== */
r.get("/internal/tracking/daily-state",verifyInternalToken,DailyState.getDailyState);
  

module.exports = r;
