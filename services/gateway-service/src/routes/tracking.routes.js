import { Router } from "express";
import { forward } from "../utils/forward.js";
import { authRequired } from "../middleware/authRequired.js";
import { requireCoach } from "../middleware/requireRole.js";

const r = Router();
const BASE = process.env.TRACKING_SERVICE_URL;

// =============================
// DAY SELECTION
// =============================

// Client updates his own day selection
r.post(
  "/tracking/day-selection",
  authRequired,
  forward(BASE, "/internal/tracking/day-selection")
);

// Coach views today's selection for a specific client
r.get(
  "/tracking/day-selection/today/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/day-selection/today/:clientId")
);

// =============================
// MEAL LOG
// =============================

// Client logs his meals
r.post(
  "/tracking/meal-log",
  authRequired,
  forward(BASE, "/internal/tracking/meal-log")
);

// Coach views meal history of a client
r.get(
  "/tracking/meal-log/history/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/meal-log/history/:clientId")
);

// =============================
// WORKOUT LOG
// =============================

// Client logs workout session
r.post(
  "/tracking/workout-log",
  authRequired,
  forward(BASE, "/internal/tracking/workout-log")
);

// Coach views workout history
r.get(
  "/tracking/workout-log/history/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/workout-log/history/:clientId")
);

// Client updates his own workout log
r.put(
  "/tracking/workout-log/:logId",
  authRequired,
  forward(BASE, "/internal/tracking/workout-log/:logId")
);

// Client updates a single exercise
r.patch(
  "/tracking/workout-log/exercise/:exerciseLogId",
  authRequired,
  forward(BASE, "/internal/tracking/workout-log/exercise/:exerciseLogId")
);

// =============================
// WEIGHT LOG
// =============================

// Client logs weight
r.post(
  "/tracking/weight-log",
  authRequired,
  forward(BASE, "/internal/tracking/weight-log")
);

// Coach views client weight history
r.get(
  "/tracking/weight-log/history/:clientId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/tracking/weight-log/history/:clientId")
);

export default r;
