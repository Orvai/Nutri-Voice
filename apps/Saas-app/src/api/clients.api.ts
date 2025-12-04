import { api } from "../api/api";
import { Client } from "../types/client";

export async function fetchClients(): Promise<Client[]> {
  const res = await api.get<{ data: Client[] }>("/clients");
  return res.data.data;
}
