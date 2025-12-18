import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutKeys } from "@/queryKeys/workoutKeys";
import {
  deleteApiWorkoutClientIdWorkoutProgramsProgramId,
} from "@common/api/sdk/nutri-api";

export function useClientDeleteWorkoutProgram(clientId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (programId: string) =>
      deleteApiWorkoutClientIdWorkoutProgramsProgramId(
        clientId,
        programId
      ),
    onSuccess: (_data, programId) => {
      queryClient.invalidateQueries({
        queryKey: workoutKeys.clientPrograms(clientId),
      });

      queryClient.removeQueries({
        queryKey: workoutKeys.clientProgram(clientId, programId),
      });
    },
  });
}
