import { Router } from "express";
import { attachUser } from "../middleware/attachUser.js";
import { authRequired } from "../middleware/authRequired.js";
import { requireCoach } from "../middleware/requireRole.js";
import { forward } from "../utils/forward.js";

const r = Router();
const BASE = process.env.WORKOUT_SERVICE_URL;

r.use(attachUser);

/* ============================================
   EXERCISES (master data)
============================================ */

r.get("/exercises", authRequired, forward(BASE, "/internal/workout/exercises"));

r.get("/exercises/:id", authRequired, forward(BASE, "/internal/workout/exercises/:id"));

r.post(
  "/exercises",
  authRequired,
  requireCoach,
  (req, res, next) => {
    req.body = { ...req.body, coachId: req.user.id };
    next();
  },
  forward(BASE, "/internal/workout/exercises")
);

r.put(
  "/exercises/:id",
  authRequired,
  requireCoach,
  (req, res, next) => {
    req.body = { ...req.body, coachId: req.user.id };
    next();
  },
  forward(BASE, "/internal/workout/exercises/:id")
);

r.delete(
  "/exercises/:id",
  authRequired,
  requireCoach,
  (req, res, next) => {
    req.body = { coachId: req.user.id };
    next();
  },
  forward(BASE, "/internal/workout/exercises/:id")
);

r.post(
  "/exercises/:id/video",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/workout/exercises/:id/video")
);

/* ============================================
   STATIC ASSETS
============================================ */
r.use("/uploads", forward(BASE, null, { preservePath: true }));

/* ============================================
   WORKOUT TEMPLATES
============================================ */

r.get("/templates", authRequired, forward(BASE, "/internal/workout/templates"));

r.get("/templates/:id", authRequired, forward(BASE, "/internal/workout/templates/:id"));

r.post(
  "/templates",
  authRequired,
  requireCoach,
  (req, res, next) => {
    req.body = { ...req.body, coachId: req.user.id };
    next();
  },
  forward(BASE, "/internal/workout/templates")
);

r.put(
  "/templates/:id",
  authRequired,
  requireCoach,
  (req, res, next) => {
    req.body = { ...req.body, coachId: req.user.id };
    next();
  },
  forward(BASE, "/internal/workout/templates/:id")
);

r.delete(
  "/templates/:id",
  authRequired,
  requireCoach,
  (req, res, next) => {
    req.body = { coachId: req.user.id };
    next();
  },
  forward(BASE, "/internal/workout/templates/:id")
);

/* ============================================
   WORKOUT PROGRAMS
============================================ */

// Coach fetching all programs
r.get("/programs", authRequired, requireCoach, forward(BASE, "/internal/workout/programs"));

r.get(
  "/programs/:programId",
  authRequired,
  requireCoach,
  forward(BASE, "/internal/workout/programs/:programId")
);

// Client or coach fetch client programs
r.get(
  "/:clientId/workout-programs",
  authRequired,
  forward(BASE, "/internal/workout/programs")
);

// Client or coach fetch single program
r.get(
  "/:clientId/workout-programs/:programId",
  authRequired,
  forward(BASE, "/internal/workout/programs/:programId")
);

// Coach assigns a workout program to a client
r.post(
  "/:clientId/workout-programs",
  authRequired,
  requireCoach,
  (req, res, next) => {
    req.body = {
      ...req.body,
      clientId: req.params.clientId,
      coachId: req.user.id,
    };
    next();
  },
  forward(BASE, "/internal/workout/programs")
);

// Coach updates program
r.put(
  "/:clientId/workout-programs/:programId",
  authRequired,
  requireCoach,
  (req, res, next) => {
    req.body = {
      ...req.body,
      clientId: req.params.clientId,
      coachId: req.user.id,
    };
    next();
  },
  forward(BASE, "/internal/workout/programs/:programId")
);

// Coach deletes program
r.delete(
  "/:clientId/workout-programs/:programId",
  authRequired,
  requireCoach,
  (req, res, next) => {
    req.body = {
      clientId: req.params.clientId,
      coachId: req.user.id,
    };
    next();
  },
  forward(BASE, "/internal/workout/programs/:programId")
);

export default r;
