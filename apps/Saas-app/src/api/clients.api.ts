import { api } from "../api/api";
import { Client } from "../types/client";

type IdmUser = {
  id: string;
  userId?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
};

export async function fetchClients(): Promise<Client[]> {
  const res = await api.get<{ data: IdmUser[] }>("/clients");

  return res.data.data.map((user) => {
    const name =
      [user.firstName, user.lastName].filter(Boolean).join(" ").trim() || user.id;

    const phone = user.phone ?? "";
    const userId = user.userId ?? user.id;

    return {
      id: user.id,
      userId,
      name,
      phone,
    };
  });
}