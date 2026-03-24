// src/mappers/workout/exercise.mapper.ts

import type { ExerciseResponseDto } from "@common/api/sdk/schemas";
import type { UIExercise } from "@/types/ui/workout/exercise.ui";
import {
  normalizeExerciseName,
  normalizeMuscleGroup,
} from "@/mappers/workout/workoutEnumMapper";

export function mapExerciseDtoToUI(dto: ExerciseResponseDto): UIExercise {
  return {
    id: dto.id,
    name: normalizeExerciseName(dto.name),
    muscleGroup: normalizeMuscleGroup(dto.muscleGroup),
    equipment: dto.equipment ?? null,
    videoUrl: dto.videoUrl ?? null,
  };
}
