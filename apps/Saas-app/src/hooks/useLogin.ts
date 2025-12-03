import { useState } from "react";
import { router } from "expo-router";
import { api } from "../api/api";
import { LoginResponse,UserProfile } from "../types/auth";
import { useAuth } from "../context/AuthContext";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setUser } = useAuth();

  async function login(email: string, password: string) {
    setError("");
    setLoading(true);

    try {
      const res = await api.post<LoginResponse>("/api/auth/login", {
        email,
        password,
      });

      const { accessToken } = res.data;

      if (!accessToken) {
        setError("שגיאה בהתחברות");
        return;
      }

      globalThis.ACCESS_TOKEN = accessToken;

      const meRes = await api.get<{ user: UserProfile }>("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setUser(meRes.data.user);

      router.replace("/(dashboard)/dashboard");
    } catch (err: any) {
      console.log("LOGIN ERROR:", err?.response?.data || err);
      setError("אימייל או סיסמה לא נכונים");
    } finally {
      setLoading(false);
    }
  }

  return { login, loading, error };
}
