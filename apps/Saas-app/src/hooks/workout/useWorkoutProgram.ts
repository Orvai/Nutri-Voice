import { useQuery } from "@tanstack/react-query";
import { fetchWorkoutProgram } from "../../api/workout-api/workoutProgram.api";
import { mapWorkoutProgramToUI } from "../../types/ui/workout-ui";

export function useWorkoutProgram(id?: string | null) {
  return useQuery({
    queryKey: ["workoutProgram", id],
    enabled: Boolean(id),
    queryFn: async () => {
      const program = await fetchWorkoutProgram(id as string);
      return mapWorkoutProgramToUI(program);
    },
  });
}