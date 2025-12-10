import { api } from "../api";
import type { Exercise } from "../../types/api/workout-types/exercise.types";

export async function fetchExercises() {
  const res = await api.get<{ data?: Exercise[] }>("/workout/exercises");
  return res.data?.data ?? [];
}

export async function uploadExerciseVideo(exerciseId: string, file: File | Blob) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post<{ videoUrl: string }>(
    `/workout/exercises/${exerciseId}/video`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data.videoUrl;
}