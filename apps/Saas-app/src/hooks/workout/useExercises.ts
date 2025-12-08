import { useQuery } from "@tanstack/react-query";
import { fetchExercises } from "../../api/workout-api/exercises.api";
import { mapExerciseToUI, type UIExercise } from "../../types/ui/workout-ui";

export function useExercises() {
  return useQuery<UIExercise[]>({
    queryKey: ["workoutExercises"],
    queryFn: async () => {
      const exercises = await fetchExercises();
      return exercises.map(mapExerciseToUI);
    },
  });
}