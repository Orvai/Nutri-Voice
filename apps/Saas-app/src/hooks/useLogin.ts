import { api } from "../api/api";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import { useState } from "react";
import { paths } from "../../../common/api/types/generated";
import { buildUserProfile, LoginResponse, UserInfoResponse } from "../types/auth";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser, setToken } = useAuth();

  async function login(email: string, password: string) {
    setError("");
    setLoading(true);

    try {
      // 🔥 1) Login
      const res = await api.post<LoginResponse>("/auth/login", { email, password });
      const { user: baseUser, tokens } = res.data;

      if (!tokens?.accessToken) {
        setError("שגיאה בהתחברות");
        return null;
      }

      // 🔥 2) Save token
      setToken(tokens.accessToken);

      // 🔥 3) Fetch expanded user info (IDM)
      const infoRes = await api.get<UserInfoResponse>(`/users/${baseUser.id}/info`);

      // 🔥 4) Merge everything into a single profile
      const profile = buildUserProfile(baseUser, infoRes.data);

      // 🔥 5) Save in context
      setUser(profile);

      // 🔥 6) Navigate
      router.replace("/(dashboard)/dashboard");

      return profile;
    } catch (err: any) {
      console.log("LOGIN ERROR:", err?.response?.data || err);
      setError("אימייל או סיסמה לא נכונים");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { login, loading, error };
}
