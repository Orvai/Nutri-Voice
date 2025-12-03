import { useState, useEffect } from "react";
import { api } from "../api/api";
import { Client } from "../types/client";

export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const res = await api.get<Client[]>("/api/clients", {
          headers: {
            Authorization: `Bearer ${globalThis.ACCESS_TOKEN}`,
          },
        });

        setClients(res.data);
      } catch (err: any) {
        console.log("CLIENTS ERROR:", err?.response?.data || err);
        setError("שגיאה בטעינת לקוחות");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return { clients, loading, error };
}
