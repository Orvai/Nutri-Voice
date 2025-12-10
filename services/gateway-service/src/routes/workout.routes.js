import { Router } from "express";
import { forward } from "../utils/forward.js";
import { authRequired } from "../middleware/authRequired.js";

const r = Router();
const BASE = process.env.WORKOUT_SERVICE_URL;

// EXERCISES (master data)
r.get(
  "/workout/exercises",
  authRequired,
  forward(BASE, "/internal/workout/exercises")
);
r.get(
  "/workout/exercises/:id",
  authRequired,
  forward(BASE, "/internal/workout/exercises/:id")
);
r.post(
  "/workout/exercises",
  authRequired,
  forward(BASE, "/internal/workout/exercises")
);
r.put(
  "/workout/exercises/:id",
  authRequired,
  forward(BASE, "/internal/workout/exercises/:id")
);
r.delete(
  "/workout/exercises/:id",
  authRequired,
  forward(BASE, "/internal/workout/exercises/:id")
);
r.post(
  "/workout/exercises/:id/video",
  authRequired,
  forward(BASE, "/internal/workout/exercises/:id/video")
);

// STATIC ASSETS
r.use("/workout/uploads", forward(BASE, null, { preservePath: true }));

// WORKOUT TEMPLATES
r.get(
  "/workout/templates",
  authRequired,
  forward(BASE, "/internal/workout/templates")
);
r.get(
  "/workout/templates/:id",
  authRequired,
  forward(BASE, "/internal/workout/templates/:id")
);
r.post(
  "/workout/templates",
  authRequired,
  forward(BASE, "/internal/workout/templates")
);
r.put(
  "/workout/templates/:id",
  authRequired,
  forward(BASE, "/internal/workout/templates/:id")
);
r.delete(
  "/workout/templates/:id",
  authRequired,
  forward(BASE, "/internal/workout/templates/:id")
);

// CLIENT WORKOUT PROGRAMS
r.get(
  "/clients/:clientId/workout-programs",
  authRequired,
  (req, res, next) => {
    req.query = { ...req.query, clientId: req.params.clientId };
    next();
  },
  forward(BASE, "/internal/workout/programs")
);

r.get(
  "/clients/:clientId/workout-programs/:programId",
  authRequired,
  forward(BASE, "/internal/workout/programs/:programId")
);

r.post(
  "/clients/:clientId/workout-programs",
  authRequired,
  (req, res, next) => {
    req.body = { ...req.body, clientId: req.params.clientId };
    next();
  },
  forward(BASE, "/internal/workout/programs")
);

r.put(
  "/clients/:clientId/workout-programs/:programId",
  authRequired,
  forward(BASE, "/internal/workout/programs/:programId")
);

r.delete(
  "/clients/:clientId/workout-programs/:programId",
  authRequired,
  forward(BASE, "/internal/workout/programs/:programId")
);

export default r;