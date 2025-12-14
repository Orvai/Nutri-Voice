import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { getApiVitamins, postApiVitamins } from "@common/api/sdk/nutri-api";
import { VitaminCreateRequestDto } from "@common/api/sdk/schemas/vitaminCreateRequestDto";
import { nutritionKeys } from "@/queryKeys/nutritionKeys";
import { mapVitamin } from "@/mappers/nutrition/vitamin.mapper";
import { Vitamin } from "@/types/ui/nutrition/vitamin.ui";


/* =========================================
   Queries
========================================= */

export function useVitamins() {
  return useQuery<Vitamin[]>({
    queryKey: nutritionKeys.vitamins(),
    queryFn: async ({ signal }) => {
      const res = await getApiVitamins(signal);
      return res.map(mapVitamin);
    },
  });
}

/* =========================================
   Mutations
========================================= */

export function useCreateVitamin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: VitaminCreateRequestDto) =>
      postApiVitamins(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: nutritionKeys.vitamins(),
      });
    },
  });
}
