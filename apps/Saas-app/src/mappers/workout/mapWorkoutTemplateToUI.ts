// src/mappers/workout/mapWorkoutTemplateToUI.ts
import type { WorkoutTemplateResponseDto } from "@common/api/sdk/schemas";
import type { UIWorkoutTemplate } from "@/types/ui/workout/workoutTemplate.ui";

export function mapWorkoutTemplateToUI(
  dto: WorkoutTemplateResponseDto
): UIWorkoutTemplate {
  return {
    id: dto.id,
    gender: dto.gender,
    level: dto.level,
    bodyType: dto.bodyType,
    workoutType: dto.workoutType,
    muscleGroups: dto.muscleGroups,
    name: dto.name,
    notes: dto.notes,
  };
}
