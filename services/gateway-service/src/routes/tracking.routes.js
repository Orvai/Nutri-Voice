import { Router } from "express";
import { attachUser } from "../middleware/attachUser.js";
import { authRequired } from "../middleware/authRequired.js";
import { ensureClientId } from "../middleware/ensureClientId.js";
import { requireCoach } from "../middleware/requireRole.js";
import { forward } from "../utils/forward.js";

const r = Router();
const BASE = process.env.TRACKING_SERVICE_URL;

r.use(attachUser);

// =============================
// CLIENT (self) ROUTES
// =============================

// Client sets day type
r.post(
  "/tracking/day-selection",
  authRequired,
  ensureClientId, // attaches clientId
  forward(BASE, "/internal/tracking/day-selection")
);

// Client logs meals
r.post(
  "/tracking/meal-log",
  authRequired,
  ensureClientId,
  forward(BASE, "/internal/tracking/meal-log")
);

// Client logs workout
r.post(
  "/tracking/workout-log",
  authRequired,
  ensureClientId,
  forward(BASE, "/internal/tracking/workout-log")
);

// Client updates workout log
r.put(
  "/tracking/workout-log/:logId",
  authRequired,
  ensureClientId,
  forward(BASE, "/internal/tracking/workout-log/:logId")
);

// Client updates single exercise
r.patch(
  "/tracking/workout-log/exercise/:exerciseLogId",
  authRequired,
  ensureClientId,
  forward(BASE, "/internal/tracking/workout-log/exercise/:exerciseLogId")
);

// Client logs weight
r.post(
  "/tracking/weight-log",
  authRequired,
  ensureClientId,
  forward(BASE, "/internal/tracking/weight-log")
);

// =============================
// COACH ROUTES
// =============================

// Coach views today's selection
r.get(
  "/tracking/day-selection/today/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/day-selection/today/:clientId")
);

// Coach views meal history
r.get(
  "/tracking/meal-log/history/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/meal-log/history/:clientId")
);

// Coach views workout history
r.get(
  "/tracking/workout-log/history/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/workout-log/history/:clientId")
);

// Coach views weight history
r.get(
  "/tracking/weight-log/history/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/weight-log/history/:clientId")
);

export default r;
