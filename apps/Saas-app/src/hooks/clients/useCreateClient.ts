import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postApiAuthRegister } from "@common/api/sdk/nutri-api";
import { RegisterRequestDto } from "@common/api/sdk/schemas";
import { clientKeys } from "@/queryKeys/clientKeys";

export type CreateClientPayload = Pick<
  RegisterRequestDto,
  "email" | "phone" | "firstName" | "lastName" | "password"
>;

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateClientPayload) => postApiAuthRegister(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.list() });
    },
  });
}

