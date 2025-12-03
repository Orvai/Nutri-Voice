import { createServiceClient } from "../utils/axiosInstance.js";

const trackingClient = createServiceClient(process.env.TRACKING_SERVICE_URL);

/* ---------- Weight Log ---------- */
export async function logWeight(clientId, payload) {
  const res = await trackingClient.post(`/internal/tracking/weight-log`, {
    ...payload,
    clientId
  });
  return res.data;
}

export async function getWeightHistory(clientId) {
  const res = await trackingClient.get(
    `/internal/tracking/weight-log/history/${clientId}`
  );
  return res.data;
}

/* ---------- Workout Log ---------- */
export async function logWorkout(clientId, payload) {
  const res = await trackingClient.post(`/internal/tracking/workout-log`, {
    ...payload,
    clientId
  });
  return res.data;
}

export async function getWorkoutHistory(clientId) {
  const res = await trackingClient.get(
    `/internal/tracking/workout-log/history/${clientId}`
  );
  return res.data;
}

export async function updateWorkout(logId, payload) {
  const res = await trackingClient.put(
    `/internal/tracking/workout-log/${logId}`,
    payload
  );
  return res.data;
}

export async function updateExercise(exerciseId, weight) {
  const res = await trackingClient.patch(
    `/internal/tracking/workout-log/exercise/${exerciseId}`,
    { weight }
  );
  return res.data;
}

/* ---------- Day Selection ---------- */
export async function setDayType(clientId, payload) {
  const res = await trackingClient.post(`/internal/tracking/day-selection`, {
    ...payload,
    clientId
  });
  return res.data;
}

export async function getTodayDayType(clientId) {
  const res = await trackingClient.get(
    `/internal/tracking/day-selection/today/${clientId}`
  );
  return res.data;
}

/* ---------- Meal Log ---------- */
export async function logMeal(clientId, payload) {
  const res = await trackingClient.post(`/internal/tracking/meal-log`, {
    ...payload,
    clientId
  });
  return res.data;
}

export async function getMealHistory(clientId) {
  const res = await trackingClient.get(
    `/internal/tracking/meal-log/history/${clientId}`
  );
  return res.data;
}
