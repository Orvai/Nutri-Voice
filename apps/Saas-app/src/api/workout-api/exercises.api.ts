import { api } from "../api";
import type { Exercise } from "../../types/api/workout-types/exercise.types";

export async function fetchExercises() {
  const res = await api.get<{ data?: Exercise[] }>("/workout/exercises");
  return res.data?.data ?? [];
}