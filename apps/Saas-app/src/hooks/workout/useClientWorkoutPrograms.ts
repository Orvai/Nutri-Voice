import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createClientWorkoutProgram,
  deleteClientWorkoutProgram,
  fetchClientWorkoutPrograms,
  updateClientWorkoutProgram,
} from "../../api/workout-api/workoutProgram.api";
import type {
  CreateWorkoutProgramPayload,
  UpdateWorkoutProgramPayload,
} from "../../types/api/workout-types/workoutProgram.types";
import { mapWorkoutProgramToUI, type UIWorkoutProgram } from "../../types/ui/workout-ui";

export function useClientWorkoutPrograms(clientId?: string) {
  const queryClient = useQueryClient();

  const programsQuery = useQuery<UIWorkoutProgram[]>({
    queryKey: ["clientWorkoutPrograms", clientId],
    enabled: !!clientId,
    queryFn: async () => {
      const programs = await fetchClientWorkoutPrograms(clientId as string);
      return (programs ?? []).map(mapWorkoutProgramToUI);
    },
  });

  const createProgram = useMutation({
    mutationFn: async (payload: CreateWorkoutProgramPayload) => {
      const program = await createClientWorkoutProgram(clientId as string, payload);
      return mapWorkoutProgramToUI(program);
    },
    onSuccess: (program) => {
      queryClient.invalidateQueries({
        queryKey: ["clientWorkoutPrograms", clientId],
      });
      queryClient.setQueryData(
        ["clientWorkoutProgram", clientId, program.id],
        program
      );
    },
  });

  const updateProgram = useMutation({
    mutationFn: async ({
      programId,
      payload,
    }: {
      programId: string;
      payload: UpdateWorkoutProgramPayload;
    }) => {
      const program = await updateClientWorkoutProgram(
        clientId as string,
        programId,
        payload
      );
      return mapWorkoutProgramToUI(program);
    },
    onSuccess: (program, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["clientWorkoutPrograms", clientId],
      });
      queryClient.setQueryData(
        ["clientWorkoutProgram", clientId, variables.programId],
        program
      );
    },
  });

  const deleteProgram = useMutation({
    mutationFn: async (programId: string) => {
      await deleteClientWorkoutProgram(clientId as string, programId);
      return programId;
    },
    onSuccess: (programId) => {
      queryClient.invalidateQueries({
        queryKey: ["clientWorkoutPrograms", clientId],
      });
      queryClient.removeQueries({
        queryKey: ["clientWorkoutProgram", clientId, programId],
      });
    },
  });

  return {
    programs: programsQuery.data ?? [],
    isLoading: programsQuery.isLoading,
    isFetching: programsQuery.isFetching,
    isError: programsQuery.isError,
    refetch: programsQuery.refetch,
    createProgram,
    updateProgram,
    deleteProgram,
  };
}