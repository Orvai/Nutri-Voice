import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createWorkoutProgram } from "../../api/workout-api/workoutPrograms.api";
import type { CreateWorkoutProgramPayload } from "../../types/api/workout-types/workoutProgram.types";
import { mapWorkoutProgramToUI } from "../../types/ui/workout-ui";

export function useCreateWorkoutProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateWorkoutProgramPayload) => {
      const program = await createWorkoutProgram(payload);
      return mapWorkoutProgramToUI(program);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["workoutPrograms"] });
      queryClient.setQueryData(["workoutProgram", data.id], data);
    },
  });
}