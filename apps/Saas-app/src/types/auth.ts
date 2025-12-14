// src/types/auth.types.ts

export type UserRole = "trainer" | "client" | "admin";

export type Gender = "male" | "female" | "other" | null;

export type UserStatus = "active" | "inactive" | "blocked";

export type AuthUser = {
  id: string;
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  gender: Gender;
  city: string | null;
  imageUrl: string | null;
};
