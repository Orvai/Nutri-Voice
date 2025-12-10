import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteClientWorkoutProgram } from "../../api/workout-api/workoutProgram.api";

export function useDeleteWorkoutProgram(clientId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) =>
      deleteClientWorkoutProgram(clientId as string, id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["clientWorkoutPrograms", clientId],
      });
      queryClient.removeQueries({
        queryKey: ["clientWorkoutProgram", clientId, id],
      });
    },
  });
}