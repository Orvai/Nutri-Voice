import { useQuery } from "@tanstack/react-query";
import { getApiClientsId } from "@common/api/sdk/nutri-api";
import { clientKeys } from "../../queryKeys/clientKeys";

export const useClientById = (clientId: string) => {
  return useQuery({
    queryKey: clientKeys.detail(clientId),
    queryFn: ({ signal }) => getApiClientsId(clientId, signal),
    enabled: !!clientId,
  });
};
