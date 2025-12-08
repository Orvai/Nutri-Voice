import { useQuery } from "@tanstack/react-query";
import { fetchWorkoutPrograms } from "../../api/workout-api/workoutProgram.api";
import { mapWorkoutProgramToUI } from "../../types/ui/workout-ui";

export function useWorkoutPrograms() {
  return useQuery({
    queryKey: ["workoutPrograms"],
    queryFn: async () => {
      const programs = await fetchWorkoutPrograms();
      return programs.map(mapWorkoutProgramToUI);
    },
  });
}