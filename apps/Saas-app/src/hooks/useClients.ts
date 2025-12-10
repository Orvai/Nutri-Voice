import { useQuery } from "@tanstack/react-query";
import { fetchClients } from "../api/clients.api";
import { ClientExtended } from "../types/client";

export function useClients() {
  return useQuery<ClientExtended[], Error>({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });
}