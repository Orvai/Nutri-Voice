export type AuthRoleDto = "client" | "trainer" | "admin";

export type AuthUserDto = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: AuthRoleDto;
  avatarUrl: string | null;
};

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type SessionTokensDto = {
  accessToken: string;
  refreshToken: string;
  expiresInSec: number;
};

export type LoginResponseDto = {
  user: AuthUserDto;
  tokens: SessionTokensDto;
};

export type ForgotPasswordRequestDto = {
  email: string;
};

export type ForgotPasswordResponseDto = {
  message: string;
};
