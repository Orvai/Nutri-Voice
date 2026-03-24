import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCommunityPost } from "@/data/mocks/repositories/communityMockRepository";
import { communityKeys } from "@/queryKeys/communityKeys";

export function useCreateCommunityPost() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: communityKeys.feed(),
    mutationFn: createCommunityPost,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: communityKeys.root() });
    }
  });

  return {
    createPost: mutation.mutateAsync,
    isCreating: mutation.isPending,
    error: mutation.error instanceof Error ? mutation.error.message : null,
    isSuccess: mutation.isSuccess
  };
}
