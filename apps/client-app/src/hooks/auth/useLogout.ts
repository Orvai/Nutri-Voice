import { useAuth } from "@/context/auth/AuthContext";

export function useLogout() {
  const { logout } = useAuth();
  return { logout };
}
