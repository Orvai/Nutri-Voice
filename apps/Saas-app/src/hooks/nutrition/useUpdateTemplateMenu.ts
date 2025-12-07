import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTemplateMenu } from "../../api/nutrition-api/menu.api";

export function useUpdateTemplateMenu(templateMenuId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => updateTemplateMenu(templateMenuId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["templateMenu", templateMenuId] });
      queryClient.invalidateQueries({ queryKey: ["templateMenus"] });
    },
  });
}
