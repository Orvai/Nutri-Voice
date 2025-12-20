const { Router } = require("express");
const verifyInternalToken = require("./middleware/verifyInternalToken");

const ClientTodayController = require("./controllers/analytics/clientToday.controller");
const CoachNutritionDeviationsController = require("./controllers/analytics/coachNutritionDeviations.controller");
const ClientProgressController = require("./controllers/analytics/clientProgress.controller");

const r = Router();

/**
 * Internal Analytics – Today snapshot
 */
r.get(
  "/internal/analytics/client/:clientId/today",
  verifyInternalToken,
  ClientTodayController.getClientToday
);



r.get(
  "/internal/analytics/coach/:coachId/nutrition-deviations",
  verifyInternalToken,
  CoachNutritionDeviationsController.getCoachNutritionDeviations
);

r.get(
  "/internal/analytics/client/:clientId/progress",
  verifyInternalToken,
  ClientProgressController.getClientProgress
);

module.exports = r;
