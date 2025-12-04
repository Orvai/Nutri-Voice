export interface LoginResponse {
  user: {
    id: string;
    email: string;
    role: "coach" | "client";
    firstName: string | null;
    lastName: string | null;
    status: "active";
  };
  sessionId: string;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
}

export interface UserProfile {
  id: string;
  email: string;
  role: "coach" | "client";
  firstName: string | null;
  lastName: string | null;
  status: string;
  phone?: string | null;
  imageUrl?: string | null;
}

export interface UserInfoResponse {
  id: string;
  userId: string;
  status: "active" | "deleted" | "archived";

  dateOfBirth?: string | null;
  gender?: string | null;
  address?: string | null;
  city?: string | null;
  profileImageUrl?: string | null;
  height?: number | null;
  age?: number | null;

  createdAt: string;
  updatedAt: string;
}

// types/auth.ts

export function buildUserProfile(
  base: LoginResponse["user"],
  info?: UserInfoResponse | null
): UserProfile {
  return {
    id: base.id,
    email: base.email,
    role: base.role,
    firstName: base.firstName,
    lastName: base.lastName,
    status: base.status, // סטטוס של היוזר עצמו, לא של הרשומת info

    // כרגע אין phone ב-UserInfo, אז null
    phone: null,

    // ממפים מ-profileImageUrl ל-imageUrl
    imageUrl: info?.profileImageUrl ?? null,
  };
}
