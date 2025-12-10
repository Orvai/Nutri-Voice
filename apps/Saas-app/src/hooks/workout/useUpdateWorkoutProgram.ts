import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateClientWorkoutProgram } from "../../api/workout-api/workoutProgram.api";
import type { UpdateWorkoutProgramPayload } from "../../types/api/workout-types/workoutProgram.types";
import { mapWorkoutProgramToUI } from "../../types/ui/workout-ui";

export function useUpdateWorkoutProgram(
  clientId?: string | null,
  id?: string | null
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateWorkoutProgramPayload) => {
      const program = await updateClientWorkoutProgram(
        clientId as string,
        id as string,
        payload
      );
      return mapWorkoutProgramToUI(program);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["clientWorkoutPrograms", clientId],
      });
      queryClient.invalidateQueries({
        queryKey: ["clientWorkoutProgram", clientId, id],
      });
      queryClient.setQueryData(["clientWorkoutProgram", clientId, id], data);
    },
    meta: { programId: id },
  });
}
