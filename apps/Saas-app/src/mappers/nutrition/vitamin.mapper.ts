import { VitaminResponseDto } from "@common/api/sdk/schemas/vitaminResponseDto";
import { Vitamin } from "@/types/ui/nutrition/vitamin.ui";

export function mapVitamin(dto: VitaminResponseDto): Vitamin {
  return {
    id: dto.id,
    name: dto.name,
    description: dto.description ?? undefined,
  };
}
