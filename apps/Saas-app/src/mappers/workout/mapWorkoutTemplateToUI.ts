// src/mappers/workout/mapWorkoutTemplateToUI.ts
import type { WorkoutTemplateResponseDto } from "@common/api/sdk/schemas";
import type { UIWorkoutTemplate } from "@/types/ui/workout/workoutTemplate.ui";
import {
  normalizeGender,
  normalizeMuscleGroup,
} from "@/mappers/workout/workoutEnumMapper";

export function mapWorkoutTemplateToUI(
  dto: WorkoutTemplateResponseDto
): UIWorkoutTemplate {
  return {
    id: dto.id,
    gender: normalizeGender(dto.gender),
    level: dto.level,
    bodyType: dto.bodyType,
    workoutType: dto.workoutType,
    muscleGroups: (dto.muscleGroups ?? []).map(normalizeMuscleGroup),
    name: dto.name,
    notes: dto.notes,
  };
}
