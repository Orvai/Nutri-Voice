import { useMutation, useQueryClient } from "@tanstack/react-query";
import { customFetcher } from "@common/api/sdk/fetcher";
import { clientKeys } from "@/queryKeys/clientKeys";

export type ClientStatusValue = "active" | "deleted";

type UpdateClientStatusPayload = {
  clientId: string;
  status: ClientStatusValue;
};

async function updateClientStatus({ clientId, status }: UpdateClientStatusPayload) {
  return customFetcher<{ id: string; status: string }>({
    url: `/api/clients/${clientId}/status`,
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    data: { status },
  });
}

export function useUpdateClientStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateClientStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clientKeys.lists() });
      queryClient.invalidateQueries({ queryKey: clientKeys.details() });
    },
  });
}
