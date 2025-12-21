// src/services/tools/workoutLog.service.js
import axios from "axios";

const GATEWAY_BASE = process.env.GATEWAY_URL || process.env.API_GATEWAY_URL || "http://localhost:4000";

function gatewayClient(userToken) {
  return axios.create({
    baseURL: GATEWAY_BASE,
    timeout: 15000,
    headers: {
      Authorization: `Bearer ${userToken}`,
      "Content-Type": "application/json",
    },
  });
}

/**
 * POST /api/tracking/workout-log
 * uses ensureClientId in gateway, so no need clientId in payload.
 */
export async function createWorkoutLog({ userToken, payload }) {
  const client = gatewayClient(userToken);
  const res = await client.post(`/api/tracking/workout-log`, payload);
  return res.data;
}

/**
 * PUT /api/tracking/workout-log/{logId}
 */
export async function updateWorkoutLog({ userToken, logId, payload }) {
  const client = gatewayClient(userToken);
  const res = await client.put(`/api/tracking/workout-log/${logId}`, payload);
  return res.data;
}

/**
 * PATCH /api/tracking/workout-log/exercise/{exerciseLogId}
 */
export async function patchWorkoutExercise({ userToken, exerciseLogId, payload }) {
  const client = gatewayClient(userToken);
  const res = await client.patch(`/api/tracking/workout-log/exercise/${exerciseLogId}`, payload);
  return res.data;
}
