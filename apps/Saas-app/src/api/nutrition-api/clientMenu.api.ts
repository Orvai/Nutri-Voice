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
