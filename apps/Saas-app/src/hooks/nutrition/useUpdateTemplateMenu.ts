import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTemplateMenu } from "../../api/nutrition-api/menu.api";

export function useUpdateTemplateMenu(templateMenuId: string) {
  const queryClient = useQueryClient();

  return useMutation<any, Error, any>({
    mutationFn: (payload) => updateTemplateMenu(templateMenuId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["templateMenu"],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["templateMenus"],
        exact: false,
      });
    },
  });
}
