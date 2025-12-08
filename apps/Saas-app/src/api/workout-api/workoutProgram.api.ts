import { api } from "../api";
import type {
  WorkoutProgram,
  CreateWorkoutProgramPayload,
  UpdateWorkoutProgramPayload,
} from "../../types/api/workout-types/workoutProgram.types";

export async function fetchWorkoutPrograms() {
  const res = await api.get<{ data: WorkoutProgram[] }>("/workout/programs");
  return res.data.data;
}

export async function fetchWorkoutProgram(id: string) {
  const res = await api.get<{ data: WorkoutProgram }>(`/workout/programs/${id}`);
  return res.data.data;
}

export async function createWorkoutProgram(payload: CreateWorkoutProgramPayload) {
  const res = await api.post<{ data: WorkoutProgram }>("/workout/programs", payload);
  return res.data.data;
}

export async function updateWorkoutProgram(
  id: string,
  payload: UpdateWorkoutProgramPayload
) {
  const res = await api.put<{ data: WorkoutProgram }>(`/workout/programs/${id}` , payload);
  return res.data.data;
}

export async function deleteWorkoutProgram(id: string) {
  const res = await api.delete<{ data: { success: boolean } }>(
    `/workout/programs/${id}`
  );
  return res.data.data;
}