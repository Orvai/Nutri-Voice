import { useState } from "react";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

import {
  postApiAuthLogin,
  getApiUsersIdInfo,
} from "@common/api/sdk/nutri-api";

type UiRole = "trainer" | "client" | "admin";

const roleMap: Record<string, UiRole> = {
  coach: "trainer",
  trainer: "trainer",
  client: "client",
  admin: "admin",
};

export function useLogin() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { setUser, setToken } = useAuth();

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);

    try {
      /* 1️ LOGIN */
      const loginRes = await postApiAuthLogin({
        email,
        password,
      });

      const { user: baseUser, tokens } = loginRes;

      if (!tokens?.accessToken) {
        throw new Error("Missing access token");
      }

      setToken(tokens.accessToken);

      /* 2️ USER INFO */
      const userInfo = await getApiUsersIdInfo(baseUser.id);

      /* 3️ BUILD UI USER */
      const profile = {
        id: baseUser.id,
        email: baseUser.email,
        phone: baseUser.phone ?? "",
        firstName: baseUser.firstName,
        lastName: baseUser.lastName,
        status: baseUser.status,
        role: roleMap[baseUser.role] ?? "client",
        gender: userInfo.gender ?? null,
        city: userInfo.city ?? null,
        imageUrl: userInfo.profileImageUrl ?? null,
      };

      setUser(profile);

      /* 4 NAVIGATE */
      router.replace("/(dashboard)/dashboard");

      return profile;
    } catch (e) {
      console.error("LOGIN ERROR:", e);
      setError("אימייל או סיסמה לא נכונים");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return {
    login,
    loading,
    error,
  };
}
