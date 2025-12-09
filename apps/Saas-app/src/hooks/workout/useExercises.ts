import { useQuery } from "@tanstack/react-query";
import { fetchExercises } from "../../api/workout-api/exercises.api";
import type { Exercise } from "../../types/api/workout-types/exercise.types";
import { mapExerciseToUI, type UIExercise } from "../../types/ui/workout-ui";

export function useExercises() {
  return useQuery<UIExercise[]>({
    queryKey: ["workoutExercises"],
    queryFn: async () => {
      const exercises = await fetchExercises();
      const parsedExercises = Array.isArray((exercises as any)?.data)
        ? (exercises as any).data
        : exercises ?? [];

      return (parsedExercises as unknown as Exercise[])
        .filter(Boolean)
        .map(mapExerciseToUI);
    },
  });
}