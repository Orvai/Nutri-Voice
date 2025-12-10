import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createClientWorkoutProgram } from "../../api/workout-api/workoutProgram.api";
import type { CreateWorkoutProgramPayload } from "../../types/api/workout-types/workoutProgram.types";
import { mapWorkoutProgramToUI } from "../../types/ui/workout-ui";

export function useCreateWorkoutProgram(clientId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateWorkoutProgramPayload) => {
      const program = await createClientWorkoutProgram(
        clientId as string,
        payload
      );
      return mapWorkoutProgramToUI(program);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["clientWorkoutPrograms", clientId],
      });
      queryClient.setQueryData(
        ["clientWorkoutProgram", clientId, data.id],
        data
      );
    },
  });
}