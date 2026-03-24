import { useQuery } from "@tanstack/react-query";
import { getApiClients } from "@common/api/sdk/nutri-api";
import { clientKeys } from "../../queryKeys/clientKeys";
import { buildClient } from "@/mappers/client.mapper";
import { ClientExtended } from "@/types/client";
import { REALTIME_INTERVAL_MS } from "@/hooks/realtime/realtime.constants";

export type ClientStatusFilter = "active" | "inactive" | "all";

type UseClientsOptions = {
  statusFilter?: ClientStatusFilter;
};

function isClientActive(client: ClientExtended) {
  return String(client.status || "active").toLowerCase() === "active";
}

function applyStatusFilter(clients: ClientExtended[], statusFilter: ClientStatusFilter) {
  if (statusFilter === "all") {
    return clients;
  }

  return clients.filter((client) =>
    statusFilter === "active" ? isClientActive(client) : !isClientActive(client)
  );
}

export const useClients = (options: UseClientsOptions = {}) => {
  const statusFilter = options.statusFilter ?? "active";

  return useQuery<ClientExtended[]>({
    queryKey: [...clientKeys.list(), statusFilter],
    queryFn: async ({ signal }) => {
      const clients = await getApiClients(signal);
      return applyStatusFilter(clients.map(buildClient), statusFilter);
    },
    refetchInterval: REALTIME_INTERVAL_MS.clients,
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
    staleTime: 0,
  });
};
