import { api } from "../api";
import { ClientMenu } from "../../types/api/nutrition-types/clientMenu.types";

export async function fetchClientMenus(clientId?: string) {
  console.log(">>> fetchClientMenus CALLED", clientId);

  const res = await api.get<{ data?: ClientMenu[] }>("/client-menus", {
    params: clientId ? { clientId } : undefined,
  });

  console.log(">>> fetchClientMenus RESPONSE", res.data);

  return res.data?.data ?? [];
}

export async function fetchClientMenu(id: string) {
  console.log(">>> fetchClientMenu CALLED", id);

  const res = await api.get<{ data?: ClientMenu }>(`/client-menus/${id}`);

  console.log(">>> fetchClientMenu RESPONSE", res.data);

  return res.data?.data ?? null;
}

export async function updateClientMenu(id: string, payload: any) {
  const res = await api.put<{ data?: ClientMenu }>(`/client-menus/${id}` ,payload);
  return res.data?.data ?? null;
}

export async function createClientMenuFromTemplate(clientId: string) {
  const res = await api.post<{ data?: ClientMenu }>(`/client-menus/from-template`, {
    clientId,
  });

  return res.data?.data ?? null;
}