import { useQuery } from "@tanstack/react-query";
import { fetchClientWorkoutProgram } from "../../api/workout-api/workoutProgram.api";
import { mapWorkoutProgramToUI } from "../../types/ui/workout-ui";

export function useWorkoutProgram(clientId?: string | null, id?: string | null) {
  return useQuery({
    queryKey: ["clientWorkoutProgram", clientId, id],
    enabled: Boolean(clientId && id),
    queryFn: async () => {
      const program = await fetchClientWorkoutProgram(
        clientId as string,
        id as string
      );
      return mapWorkoutProgramToUI(program);
    },
  });
}
