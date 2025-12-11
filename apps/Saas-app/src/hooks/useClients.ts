import { useQuery } from "@tanstack/react-query";
import { api } from "../api/api";
import { paths } from "../../../common/api/types/generated";
import { ClientExtended } from "../types/client";
import { buildClient } from "../mappers/client.mapper";

type ClientsApiResponse =
  paths["/api/clients"]["get"]["responses"]["200"]["content"]["application/json"];

export function useClients() {
  return useQuery<ClientExtended[], Error>({
    queryKey: ["clients"],
    queryFn: async () => {
      const res = await api.get<ClientsApiResponse>("/clients");
      return res.data.data.map(buildClient);
    },
  });
}
