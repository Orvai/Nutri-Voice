// src/mappers/workout/exercise.mapper.ts

import type { ExerciseResponseDto } from "@common/api/sdk/schemas";
import type { UIExercise } from "@/types/ui/workout/exercise.ui";

export function mapExerciseDtoToUI(dto: ExerciseResponseDto): UIExercise {
  return {
    id: dto.id,
    name: dto.name,
    muscleGroup: dto.muscleGroup,
    equipment: dto.equipment ?? null,
    videoUrl: dto.videoUrl ?? null,
  };
}