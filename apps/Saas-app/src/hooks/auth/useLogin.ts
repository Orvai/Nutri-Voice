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

  const { setUser, setSessionTokens, logout } = useAuth();

  async function login(email: string, password: string) {
    setLoading(true);
    setError(null);

    try {
      const loginRes = await postApiAuthLogin({
        email,
        password,
      });

      const { user: baseUser, tokens } = loginRes;

      if (
        typeof tokens?.accessToken !== "string" ||
        tokens.accessToken.length === 0
      ) {
        throw new Error("Missing access token");
      }

      if (
        typeof tokens?.refreshToken !== "string" ||
        tokens.refreshToken.length === 0
      ) {
        throw new Error("Missing refresh token");
      }

      setSessionTokens({
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });

      const userInfo = await getApiUsersIdInfo(baseUser.id);

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

      router.replace("/(dashboard)/dashboard");

      return profile;
    } catch (e) {
      console.error("LOGIN ERROR:", e);
      await logout({ redirectToLogin: false });
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
