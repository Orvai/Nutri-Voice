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
  phone: string,
  role: "trainer" | "client" | "admin";
  firstName: string | null;
  lastName: string | null;
  status: string;

  // Optional profile-related fields:
  gender?: string | null;
  city?: string | null;
  imageUrl?: string | null;
  // ✨ שדות מורחבים
  address?: string | null;
  dateOfBirth?: string | null;
  height?: number | null;
  age?: number | null;
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

const roleMap: Record<string, UserProfile["role"]> = {
  coach: "trainer", 
  client: "client",
  admin: "admin",   
};



export function buildUserProfile(
  base: LoginResponse["user"],
  info?: UserInfoResponse | null
): UserProfile {
  return {
    // ---- בסיס מ-login ----
    id: base.id,
    email: base.email,
    role: roleMap[base.role] ?? "client",
    firstName: base.firstName,
    lastName: base.lastName,
    status: base.status,

    // ---- phone: אם מגיע מ-login העתידי או מה-IDM ----
    phone: (base as any).phone ?? null,  // תואם לכל הרחבה עתידית

    // ---- מידע מ-user info ----
    gender: info?.gender ?? null,
    city: info?.city ?? null,
    imageUrl: info?.profileImageUrl ?? null,

    address: info?.address ?? null,
    dateOfBirth: info?.dateOfBirth ?? null,
    height: info?.height ?? null,
     age: info?.age ?? null,
  };
}