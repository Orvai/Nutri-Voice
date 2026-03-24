import { useMutation } from "@tanstack/react-query";
import { loginWithEmail } from "@/data/mocks/repositories/authMockRepository";
import { mapAuthUserToUI } from "@/mappers/auth/auth.mapper";
import { authKeys } from "@/queryKeys/authKeys";
import { useAuth } from "@/context/auth/AuthContext";

export function useLogin() {
  const { setSessionTokens, setUser, logout } = useAuth();

  const mutation = useMutation({
    mutationKey: authKeys.login(),
    mutationFn: loginWithEmail,
    onSuccess: (response) => {
      setSessionTokens({
        accessToken: response.tokens.accessToken,
        refreshToken: response.tokens.refreshToken
      });
      setUser(mapAuthUserToUI(response.user));
    },
    onError: async () => {
      await logout({ redirectToLogin: false });
    }
  });

  return {
    login: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    isSuccess: mutation.isSuccess
  };
}
