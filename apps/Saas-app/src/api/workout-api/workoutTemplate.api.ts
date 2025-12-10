import { api } from "../api";
import type { WorkoutTemplate } from "../../types/api/workout-types/workoutTemplate.types";

export async function fetchWorkoutTemplates() {
  const res = await api.get<{ data: WorkoutTemplate[] }>("/workout/templates");
  return res.data.data;
}

export async function fetchWorkoutTemplate(id: string) {
  const res = await api.get<{ data: WorkoutTemplate }>(`/workout/templates/${id}`);
  return res.data.data;
}

export async function createWorkoutTemplate(payload: Omit<WorkoutTemplate, "id">) {
  const res = await api.post<{ data: WorkoutTemplate }>(
    "/workout/templates",
    payload
  );
  return res.data.data;
}

export async function updateWorkoutTemplate(
  id: string,
  payload: Partial<WorkoutTemplate>
) {
  const res = await api.put<{ data: WorkoutTemplate }>(
    `/workout/templates/${id}`,
    payload
  );
  return res.data.data;
}

export async function deleteWorkoutTemplate(id: string) {
  const res = await api.delete<{ data: { success: boolean } | null }>(
    `/workout/templates/${id}`
  );
  return res.data.data;
}