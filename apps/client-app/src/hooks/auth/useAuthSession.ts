import { useAuth } from "@/context/auth/AuthContext";

export function useAuthSession() {
  return useAuth();
}
