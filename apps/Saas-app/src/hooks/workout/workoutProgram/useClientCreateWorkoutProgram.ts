import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutKeys } from "@/queryKeys/workoutKeys";
import {
  postApiWorkoutClientIdWorkoutPrograms,
} from "@common/api/sdk/nutri-api";

type CreateWorkoutProgramInput = {
  name: string;
  templateId?: string;
};

export function useCreateWorkoutProgram(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateWorkoutProgramInput) =>
      postApiWorkoutClientIdWorkoutPrograms(clientId, input),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: workoutKeys.clientPrograms(clientId),
      });
    },
  });
}
