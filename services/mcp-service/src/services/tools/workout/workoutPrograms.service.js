// src/services/tools/workoutPrograms.service.js
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
 * GET /api/workout/{clientId}/workout-programs
 * gateway route:
 * r.get("/:clientId/workout-programs", authRequired, forward(BASE, "/internal/workout/programs"));
 */
export async function fetchWorkoutPrograms({ userToken, clientId }) {
  const client = gatewayClient(userToken);
  const res = await client.get(`/api/workout/${clientId}/workout-programs`);
  return res.data;
}
