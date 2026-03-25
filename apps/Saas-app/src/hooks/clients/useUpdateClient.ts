import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetcher } from "@common/api/sdk/fetcher";
import { clientKeys } from "@/queryKeys/clientKeys";

export type UpdateClientPayload = {
  clientId: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

async function updateClient(payload: UpdateClientPayload) {
  const { clientId, ...data } = payload;

  return customFetcher<{ id: string }>({
    url: `/api/clients/${clientId}`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data,
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClient,
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.detail(variables.clientId) });
      queryClient.invalidateQueries({ queryKey: clientKeys.details() });
    },
  });
}
