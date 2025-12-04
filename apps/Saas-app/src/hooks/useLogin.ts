import { api } from "../api/api";
import {
  LoginResponse,
  UserProfile,
  UserInfoResponse,
  buildUserProfile,
} from "../types/auth";
import { useAuth } from "../context/AuthContext";
import { router } from "expo-router";
import { useState } from "react";

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser, setToken } = useAuth();

  async function login(
    email: string,
    password: string
  ): Promise<UserProfile | null> {
    setError("");
    setLoading(true);

    try {
      const res = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });

      const { user: baseUser, tokens } = res.data;
      if (!tokens?.accessToken) {
        setError("שגיאה בהתחברות");
        return null;
      }

      setToken(tokens.accessToken);

      const infoRes = await api.get<UserInfoResponse>(
        `/users/${baseUser.id}/info`
      );

      const profile = buildUserProfile(baseUser, infoRes.data);

      setUser(profile);

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
