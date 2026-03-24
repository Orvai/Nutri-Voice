import { useMutation } from "@tanstack/react-query";
import { requestPasswordReset } from "@/data/mocks/repositories/authMockRepository";
import { authKeys } from "@/queryKeys/authKeys";

export function useForgotPassword() {
  const mutation = useMutation({
    mutationKey: authKeys.forgotPassword(),
    mutationFn: requestPasswordReset
  });

  return {
    submitReset: mutation.mutateAsync,
    loading: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    message: mutation.data?.message ?? null,
    isSuccess: mutation.isSuccess
  };
}
