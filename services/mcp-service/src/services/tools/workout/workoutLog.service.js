// src/services/tools/workoutLog.service.js
import { callGateway } from "../../../http/gatewayClient.js";

export async function createWorkoutLog(payload, context) {
  const res = await callGateway({
    contractKey: "WORKOUT_LOG_CREATE",
    sender: context.sender, 
    context,
    body: payload,
  });

  return res?.data ?? res;
}

export async function updateWorkoutLog(logId, payload, context) {
  const res = await callGateway({
    contractKey: "WORKOUT_LOG_UPDATE",
    sender: context.sender,
    context,
    pathParams: { logId },
    body: payload,
  });

  return res?.data ?? res;
}

export async function patchWorkoutExercise(exerciseLogId, payload, context) {
  const res = await callGateway({
    contractKey: "WORKOUT_LOG_UPDATE_EXERCISE",
    sender: context.sender,
    context,
    pathParams: { exerciseLogId },
    body: payload,
  });

  return res?.data ?? res;
}
