import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteWorkoutProgram } from "../../api/workout-api/workoutPrograms.api";

export function useDeleteWorkoutProgram() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => deleteWorkoutProgram(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ["workoutPrograms"] });
      queryClient.removeQueries({ queryKey: ["workoutProgram", id] });
    },
  });
}