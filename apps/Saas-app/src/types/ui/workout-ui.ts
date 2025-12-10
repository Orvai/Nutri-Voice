import type {
  Exercise,
  WorkoutExercise as ApiWorkoutExercise,
} from "../api/workout-types/exercise.types";
import type { WorkoutProgram } from "../api/workout-types/workoutProgram.types";
import type { WorkoutTemplate } from "../api/workout-types/workoutTemplate.types";

export interface UIExercise {
  id: string;
  name: string;
  muscleGroup: string | null;
  secondaryMuscles: string[];
  workoutTypes: string[];
  equipment: string | null;
  difficulty: Exercise["difficulty"];
  instructions: string | null;
  videoUrl?: string | null;
}

export interface UIWorkoutExercise {
  id: string;
  order: number;
  sets: number;
  reps: string;
  weight: number | null;
  rest: number | null;
  notes: string | null;
  exercise: UIExercise;
}

export interface UIWorkoutProgram {
  id: string;
  name: string;
  goal: string | null;
  level: WorkoutProgram["level"] | "beginner" | "intermediate" | "advanced";
  durationWeeks?: number | null;
  sessionsPerWeek?: number | null;
  notes: string | null;
  exercises: UIWorkoutExercise[];
  summary?: string;
  templateMuscleGroups?: WorkoutTemplate["muscleGroups"];
}

export interface UIWorkoutTemplate {
  id: string;
  gender: WorkoutTemplate["gender"];
  level: WorkoutTemplate["level"];
  bodyType: WorkoutTemplate["bodyType"];
  workoutType: WorkoutTemplate["workoutType"];
  muscleGroups: WorkoutTemplate["muscleGroups"];
  name?: string | null;
  notes?: string | null;
}

export function mapExerciseToUI(exercise: Exercise): UIExercise {
  return {
    id: exercise.id,
    name: exercise.name,
    muscleGroup: exercise.muscleGroup ?? null,
    secondaryMuscles: exercise.secondaryMuscles ?? [],
    workoutTypes: exercise.workoutTypes ?? [],
    equipment: exercise.equipment ?? null,
    difficulty: exercise.difficulty,
    instructions: exercise.instructions ?? null,
    videoUrl: exercise.videoUrl ?? null,
  };
}

export function mapWorkoutExerciseToUI(workoutExercise: ApiWorkoutExercise): UIWorkoutExercise {
  return {
    id: workoutExercise.id,
    order: workoutExercise.order,
    sets: workoutExercise.sets,
    reps: workoutExercise.reps ?? "",
    weight: workoutExercise.weight ?? null,
    rest: (workoutExercise as any).rest ?? null,
    notes: workoutExercise.notes ?? null,
    exercise: mapExerciseToUI(workoutExercise.exercise),
  };
}

export function mapWorkoutProgramToUI(program: WorkoutProgram): UIWorkoutProgram {
  return {
    id: program.id,
    name: program.name ?? "",
    goal: (program as any).goal ?? null,
    level: (program as any).level ?? "beginner",
    durationWeeks: (program as any).durationWeeks ?? null,
    sessionsPerWeek: (program as any).sessionsPerWeek ?? null,
    notes: (program as any).notes ?? null,
    summary: (program as any).goal ?? undefined,
    templateMuscleGroups: (program as any).templateMuscleGroups,
    exercises: (program.exercises ?? [])
      .map(mapWorkoutExerciseToUI)
      .sort((a, b) => a.order - b.order),
  };
}

export function mapWorkoutTemplateToUI(
  template: WorkoutTemplate
): UIWorkoutTemplate {
  return {
    id: template.id,
    gender: template.gender,
    level: template.level,
    bodyType: template.bodyType ?? null,
    workoutType: template.workoutType,
    muscleGroups: template.muscleGroups ?? [],
    name: template.name ?? "תבנית אימון",
    notes: template.notes ?? null,
  };
}

export function mapTemplateLevel(level: number): UIWorkoutProgram["level"] {
  if (level <= 1) return "beginner";
  if (level === 2) return "intermediate";
  return "advanced";
}