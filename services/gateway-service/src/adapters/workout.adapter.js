import { createServiceClient } from "../utils/axiosInstance.js";

const workout = createServiceClient(process.env.WORKOUT_SERVICE_URL);

/* ---------------------------------------------------------
   EXERCISES (CRUD)
--------------------------------------------------------- */

export async function createExercise(payload) {
  const res = await workout.post("/internal/workout/exercises", payload);
  return res.data;
}

export async function listExercises(query = {}) {
  const res = await workout.get("/internal/workout/exercises", { params: query });
  return res.data;
}

export async function getExercise(id) {
  const res = await workout.get(`/internal/workout/exercises/${id}`);
  return res.data;
}

export async function updateExercise(id, payload) {
  const res = await workout.put(`/internal/workout/exercises/${id}`, payload);
  return res.data;
}

export async function deleteExercise(id) {
  const res = await workout.delete(`/internal/workout/exercises/${id}`);
  return res.data;
}

/* ---------------------------------------------------------
   WORKOUT TEMPLATES (Read-Only)
--------------------------------------------------------- */

export async function listWorkoutTemplates(query = {}) {
  const res = await workout.get("/internal/workout/templates", { params: query });
  return res.data;
}

export async function getWorkoutTemplate(id) {
  const res = await workout.get(`/internal/workout/templates/${id}`);
  return res.data;
}

/* ---------------------------------------------------------
   WORKOUT PROGRAMS (CRUD)
--------------------------------------------------------- */

export async function createWorkoutProgram(payload) {
  const res = await workout.post("/internal/workout/programs", payload);
  return res.data;
}

export async function listWorkoutPrograms(query = {}) {
  const res = await workout.get("/internal/workout/programs", { params: query });
  return res.data;
}

export async function getWorkoutProgram(id) {
  const res = await workout.get(`/internal/workout/programs/${id}`);
  return res.data;
}

export async function updateWorkoutProgram(id, payload) {
  const res = await workout.put(`/internal/workout/programs/${id}`, payload);
  return res.data;
}

export async function deleteWorkoutProgram(id) {
  const res = await workout.delete(`/internal/workout/programs/${id}`);
  return res.data;
}
