export type AuthRole = "client" | "trainer" | "admin";

export type AuthUser = {
  id: string;
  email: string;
  fullName: string;
  role: AuthRole;
  avatarUrl: string | null;
};

export type SessionTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};
