const { Router } = require("express");
const verifyInternalToken = require("./middleware/verifyInternalToken");

const Exercises = require("./controllers/exercise.controller");
const Templates = require("./controllers/workoutTemplate.controller");
const Programs = require("./controllers/workoutProgram.controller");
const { videoUpload } = require("./middleware/videoUpload");

const r = Router();

/* Exercises */
r.post("/internal/workout/exercises", verifyInternalToken, Exercises.createExercise);
r.get("/internal/workout/exercises", verifyInternalToken, Exercises.listExercises);
r.get("/internal/workout/exercises/:id", verifyInternalToken, Exercises.getExercise);
r.put("/internal/workout/exercises/:id", verifyInternalToken, Exercises.updateExercise);
r.delete("/internal/workout/exercises/:id", verifyInternalToken, Exercises.deleteExercise);
r.post("/internal/workout/exercises/:id/video",verifyInternalToken,videoUpload.single("file"),Exercises.uploadExerciseVideo);

/* Workout Templates */
r.get("/internal/workout/templates", verifyInternalToken, Templates.listTemplates);
r.get("/internal/workout/templates/:id", verifyInternalToken, Templates.getTemplate);
r.post("/internal/workout/templates",verifyInternalToken,Templates.createTemplate);
r.put("/internal/workout/templates/:id",verifyInternalToken,Templates.updateTemplate);
r.delete("/internal/workout/templates/:id",verifyInternalToken,Templates.deleteTemplate);

/* Workout Programs */
r.post("/internal/workout/programs", verifyInternalToken, Programs.createProgram);
r.get("/internal/workout/programs", verifyInternalToken, Programs.listPrograms);
r.get("/internal/workout/programs/:id", verifyInternalToken, Programs.getProgram);
r.put("/internal/workout/programs/:id", verifyInternalToken, Programs.updateProgram);
r.delete("/internal/workout/programs/:id", verifyInternalToken, Programs.deleteProgram);

module.exports = r;
