import { api } from "../api/api";
import { ClientExtended } from "../types/client";

export async function fetchClients(): Promise<ClientExtended[]> {
  const res = await api.get<{ data: ClientExtended[] }>("/clients");

  return res.data.data ?? [];
}