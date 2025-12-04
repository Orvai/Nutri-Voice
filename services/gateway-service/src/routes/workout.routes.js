import { Router } from "express";
import { forward } from "../utils/forward.js";
import { authRequired } from "../middleware/authRequired.js";

const r = Router();
const BASE = process.env.WORKOUT_SERVICE_URL;

// EXERCISES
r.get("/exercises", authRequired, forward(BASE, "/internal/workout/exercises"));
r.post("/exercises", authRequired, forward(BASE, "/internal/workout/exercises"));
r.get("/exercises/:id", authRequired, forward(BASE, "/internal/workout/exercises/:id"));
r.put("/exercises/:id", authRequired, forward(BASE, "/internal/workout/exercises/:id"));
r.delete("/exercises/:id", authRequired, forward(BASE, "/internal/workout/exercises/:id"));

// TEMPLATES
r.get("/templates", authRequired, forward(BASE, "/internal/workout/templates"));
r.get("/templates/:id", authRequired, forward(BASE, "/internal/workout/templates/:id"));

// PROGRAMS
r.get("/programs", authRequired, forward(BASE, "/internal/workout/programs"));
r.post("/programs", authRequired, forward(BASE, "/internal/workout/programs"));
r.get("/programs/:id", authRequired, forward(BASE, "/internal/workout/programs/:id"));
r.put("/programs/:id", authRequired, forward(BASE, "/internal/workout/programs/:id"));
r.delete("/programs/:id", authRequired, forward(BASE, "/internal/workout/programs/:id"));

export default r;
