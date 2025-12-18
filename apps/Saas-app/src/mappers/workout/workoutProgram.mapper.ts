import type {
    WorkoutProgramResponseDto,
  } from "@common/api/sdk/schemas";
  import type {
    UIWorkoutExercise,
    UIWorkoutProgram,
  } from "@/types/ui/workout/workoutProgram.ui";
  
  type WorkoutProgramExerciseDto =
    WorkoutProgramResponseDto["exercises"][number];
  
  export function mapWorkoutExerciseToUI(
    dto: WorkoutProgramExerciseDto
  ): UIWorkoutExercise {
    return {
      id: dto.id,
      exerciseId: dto.exerciseId,
      name: dto.exercise.name,
      muscleGroup: dto.exercise.muscleGroup,
      sets: dto.sets,
      reps: dto.reps,
      weight: dto.weight,
      rest: dto.rest,
      order: dto.order,
      notes: dto.notes,
    };
  }
  
  export function mapWorkoutProgramToUI(
    dto: WorkoutProgramResponseDto
  ): UIWorkoutProgram {
    return {
      id: dto.id,
      name: dto.name,
      clientId: dto.clientId,
      coachId: dto.coachId,
      templateId: dto.templateId ?? null,
      createdAt: dto.createdAt,
      updatedAt: dto.updatedAt,
      exercises: dto.exercises.map(mapWorkoutExerciseToUI),
    };
  }
  