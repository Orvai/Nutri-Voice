import { useQuery } from "@tanstack/react-query";
import { fetchClientWorkoutPrograms } from "../../api/workout-api/workoutProgram.api";
import { mapWorkoutProgramToUI } from "../../types/ui/workout-ui";

export function useWorkoutPrograms(clientId?: string) {
  return useQuery({
    queryKey: ["clientWorkoutPrograms", clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const programs = await fetchClientWorkoutPrograms(clientId as string);
      return programs.map(mapWorkoutProgramToUI);
    },
  });
}