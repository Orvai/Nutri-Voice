import { useAuth } from "@/context/AuthContext";
import { postApiAuthLogout } from "@common/api/sdk/nutri-api";

export function useLogout() {
  const { logout } = useAuth();

  async function signOut() {
    try {
      await postApiAuthLogout();
    } catch (e) {
      console.warn("Logout failed, clearing local session");
    } finally {
      await logout({ redirectToLogin: true });
    }
  }

  return { signOut };
}
