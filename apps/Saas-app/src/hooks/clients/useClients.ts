import { useQuery } from "@tanstack/react-query";
import { getApiClients } from "@common/api/sdk/nutri-api";
import { clientKeys } from "../../queryKeys/clientKeys";
import { buildClient } from "@/mappers/client.mapper";
import { ClientExtended } from "@/types/client";

type ClientsApiResponse = {
  data: any[];
};

export const useClients = () => {
  return useQuery<ClientExtended[]>({
    queryKey: clientKeys.list(),
    queryFn: async ({ signal }) => {
      const clients = await getApiClients(signal);
      return clients.map(buildClient);
    },
  });
};