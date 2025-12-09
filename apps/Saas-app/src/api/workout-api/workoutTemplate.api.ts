import { api } from "../api";
import type { WorkoutTemplate } from "../../types/api/workout-types/workoutTemplate.types";

export async function fetchWorkoutTemplates() {
  const res = await api.get<{ data: WorkoutTemplate[] }>("/api/workout/templates");
  return res.data.data;
}

export async function fetchWorkoutTemplate(id: string) {
  const res = await api.get<{ data: WorkoutTemplate }>(`/api/workout/templates/${id}`);
  return res.data.data;
}
