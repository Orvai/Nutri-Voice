import { useQuery } from "@tanstack/react-query";
import { fetchClients } from "../api/clients.api";
import { Client } from "../types/client";

export function useClients() {
  return useQuery<Client[], Error>({
    queryKey: ["clients"],
    queryFn: fetchClients,
  });
}
