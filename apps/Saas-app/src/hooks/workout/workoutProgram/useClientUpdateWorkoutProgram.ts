import { useMutation, useQueryClient } from "@tanstack/react-query";
import { workoutKeys } from "@/queryKeys/workoutKeys";
import { putApiWorkoutClientIdWorkoutProgramsProgramId } from "@common/api/sdk/nutri-api";
import type { WorkoutProgramUpdateRequestDto } from "@common/api/sdk/schemas";

type UpdateVars = {
  programId: string;
  dto: WorkoutProgramUpdateRequestDto;
};

export function useUpdateWorkoutProgram(clientId: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ programId, dto }: UpdateVars) =>
      putApiWorkoutClientIdWorkoutProgramsProgramId(clientId, programId, dto),
    onSuccess: (_data, vars) => {
      qc.invalidateQueries({ queryKey: workoutKeys.clientPrograms(clientId) });
      qc.invalidateQueries({ queryKey: workoutKeys.clientProgram(clientId, vars.programId) });
    },
  });
}
