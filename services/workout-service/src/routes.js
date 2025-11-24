// src/routes.js
const { Router } = require("express");

const { authRequired } = require("./middleware/auth");
const requireCoach = require("./middleware/requireCoach");
const requireClientOrCoachOwner = require("./middleware/requireClientOrCoachOwner");

const Exercises = require("./controllers/exercise.controller");
const Templates = require("./controllers/workoutTemplate.controller");
const Programs = require("./controllers/workoutProgram.controller");

const r = Router();

/* Exercises (coach can CRUD, client can only list) */
r.post("/workout/exercises", authRequired, requireCoach, Exercises.createExercise);
r.get("/workout/exercises", authRequired, Exercises.listExercises);
r.get("/workout/exercises/:id", authRequired, Exercises.getExercise);
r.put("/workout/exercises/:id", authRequired, requireCoach, Exercises.updateExercise);
r.delete("/workout/exercises/:id", authRequired, requireCoach, Exercises.deleteExercise);

/* Workout Templates (read-only) */
r.get("/workout/templates", authRequired, Templates.listTemplates);
r.get("/workout/templates/:id", authRequired, Templates.getTemplate);

/* Client Workout Programs */
r.post("/workout/programs", authRequired, requireCoach, Programs.createProgram);
r.get("/workout/programs", authRequired, requireClientOrCoachOwner, Programs.listPrograms);
r.get("/workout/programs/:id", authRequired, requireClientOrCoachOwner, Programs.getProgram);
r.put("/workout/programs/:id", authRequired, requireCoach, Programs.updateProgram);
r.delete("/workout/programs/:id", authRequired, requireCoach, Programs.deleteProgram);

module.exports = r;