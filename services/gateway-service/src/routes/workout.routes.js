import { Router } from "express";
import { forward } from "../utils/forward.js";
import { authRequired } from "../middleware/authRequired.js";

const r = Router();
const BASE = process.env.WORKOUT_SERVICE_URL;

/* ============================================
   EXERCISES (master data)
============================================ */

r.get(
  "/exercises",
  authRequired,
  forward(BASE, "/internal/workout/exercises")
);

r.get(
  "/exercises/:id",
  authRequired,
  forward(BASE, "/internal/workout/exercises/:id")
);

r.post(
  "/exercises",
  authRequired,
  (req, res, next) => {
    req.body = { ...req.body, coachId: req.user.id };
    next();
  },
  forward(BASE, "/internal/workout/exercises")
);

r.put(
  "/exercises/:id",
  authRequired,
  (req, res, next) => {
    req.body = { ...req.body, coachId: req.user.id };
    next();
  },
  forward(BASE, "/internal/workout/exercises/:id")
);

r.delete(
  "/exercises/:id",
  authRequired,
  (req, res, next) => {
    req.body = { coachId: req.user.id };
    next();
  },
  forward(BASE, "/internal/workout/exercises/:id")
);

r.post(
  "/exercises/:id/video",
  authRequired,
  forward(BASE, "/internal/workout/exercises/:id/video")
);

/* ============================================
   STATIC ASSETS
============================================ */
r.use("/uploads", forward(BASE, null, { preservePath: true }));

/* ============================================
   WORKOUT TEMPLATES
============================================ */

r.get(
  "/templates",
  authRequired,
  forward(BASE, "/internal/workout/templates")
);

r.get(
  "/templates/:id",
  authRequired,
  forward(BASE, "/internal/workout/templates/:id")
);

r.post(
  "/templates",
  authRequired,
  (req, res, next) => {
    req.body = { ...req.body, coachId: req.user.id };
    next();
  },
  forward(BASE, "/internal/workout/templates")
);

r.put(
  "/templates/:id",
  authRequired,
  (req, res, next) => {
    req.body = { ...req.body, coachId: req.user.id };
    next();
  },
  forward(BASE, "/internal/workout/templates/:id")
);

r.delete(
  "/templates/:id",
  authRequired,
  (req, res, next) => {
    req.body = { coachId: req.user.id };
    next();
  },
  forward(BASE, "/internal/workout/templates/:id")
);

/* ============================================
   CLIENT WORKOUT PROGRAMS
============================================ */

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
  forward(BASE, "/internal/workout/programs/:id")
);

r.post(
  "/clients/:clientId/workout-programs",
  authRequired,
  (req, res, next) => {
    req.body = {
      ...req.body,
      clientId: req.params.clientId,
      coachId: req.user.id,     // 👈 חובה
    };
    next();
  },
  forward(BASE, "/internal/workout/programs")
);

r.put(
  "/clients/:clientId/workout-programs/:programId",
  authRequired,
  (req, res, next) => {
    req.body = {
      ...req.body,
      coachId: req.user.id,     // 👈 חובה
    };
    next();
  },
  forward(BASE, "/internal/workout/programs/:id")
);

r.delete(
  "/clients/:clientId/workout-programs/:programId",
  authRequired,
  (req, res, next) => {
    req.body = { coachId: req.user.id };  // 👈 חובה
    next();
  },
  forward(BASE, "/internal/workout/programs/:id")
);

export default r;
