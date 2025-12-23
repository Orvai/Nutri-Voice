// src/services/tools/workoutPrograms.service.js
import { callGateway } from "../../../http/gatewayClient.js";

/**
 * Fetch workout programs for a client (PATH)
 */
export async function fetchWorkoutPrograms(_, context) {
  if (!context?.clientId) {
    throw new Error("Missing context.clientId for workout programs");
  }

  const res = await callGateway({
    contractKey: "WORKOUT_PROGRAMS_LIST_FOR_CLIENT",
    sender: context.sender,
    context,
    pathParams: { clientId: context.clientId },
  });

  return res?.data ?? res;
}
