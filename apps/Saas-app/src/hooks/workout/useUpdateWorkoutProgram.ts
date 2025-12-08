import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateWorkoutProgram } from "../../api/workout-api/workoutPrograms.api";
import type { UpdateWorkoutProgramPayload } from "../../types/api/workout-types/workoutProgram.types";
import { mapWorkoutProgramToUI } from "../../types/ui/workout-ui";

export function useUpdateWorkoutProgram(id?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: UpdateWorkoutProgramPayload) => {
      const program = await updateWorkoutProgram(id as string, payload);
      return mapWorkoutProgramToUI(program);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workoutPrograms"] });
      queryClient.invalidateQueries({ queryKey: ["workoutProgram", id] });
      queryClient.setQueryData(["workoutProgram", id], data);
    },
    meta: { programId: id },
  });
}