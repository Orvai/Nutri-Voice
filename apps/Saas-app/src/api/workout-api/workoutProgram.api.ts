import { api } from "../api";
import type {
  WorkoutProgram,
  CreateWorkoutProgramPayload,
  UpdateWorkoutProgramPayload,
} from "../../types/api/workout-types/workoutProgram.types";

export async function fetchClientWorkoutPrograms(clientId: string) {
  const res = await api.get<{ data: WorkoutProgram[] }>(
    `/workout/${clientId}/workout-programs`
  );
  return res.data?.data ?? [];
}

export async function fetchClientWorkoutProgram(
  clientId: string,
  programId: string
) {
  const res = await api.get<{ data: WorkoutProgram }>(
    `/workout/${clientId}/workout-programs/${programId}`
  );
  return res.data?.data;
}

export async function createClientWorkoutProgram(
  clientId: string,
  payload: CreateWorkoutProgramPayload
) {
  const res = await api.post<{ data: WorkoutProgram }>(
    `/workout/${clientId}/workout-programs`,
    payload
  );
  return res.data?.data;
}

export async function updateClientWorkoutProgram(
  clientId: string,
  programId: string,
  payload: UpdateWorkoutProgramPayload
) {
  const res = await api.put<{ data: WorkoutProgram }>(
    `/workout/${clientId}/workout-programs/${programId}`,
    payload
  );
  return res.data?.data;
}

export async function deleteClientWorkoutProgram(
  clientId: string,
  programId: string
) {
  const res = await api.delete<{ data: { success: boolean } | null }>(
    `/workout/${clientId}/workout-programs/${programId}`
  );
  return res.data?.data;
}