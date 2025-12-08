import type {
  Exercise,
  WorkoutExercise as ApiWorkoutExercise,
} from "../api/workout-types/exercise.types";
import type { WorkoutProgram } from "../api/workout-types/workoutProgram.types";
import type { WorkoutTemplate } from "../api/workout-types/workoutTemplate.types";

export interface UIExercise {
  id: string;
  name: string;
  primaryMuscle: string;
  secondaryMuscles: string[];
  equipment: string | null;
  difficulty: Exercise["difficulty"];
  instructions: string | null;
  videoUrl?: string | null;
}

export interface UIWorkoutExercise {
  id: string;
  order: number;
  sets: number;
  reps: number | null;
  durationSeconds: number | null;
  restSeconds: number | null;
  notes: string | null;
  exercise: UIExercise;
}

export interface UIWorkoutProgram {
  id: string;
  name: string;
  goal: string | null;
  level: WorkoutProgram["level"];
  durationWeeks: number | null;
  sessionsPerWeek: number | null;
  notes: string | null;
  exercises: UIWorkoutExercise[];
  summary?: string;
}

export function mapExerciseToUI(exercise: Exercise): UIExercise {
  return {
    id: exercise.id,
    name: exercise.name,
    primaryMuscle: exercise.primaryMuscle,
    secondaryMuscles: exercise.secondaryMuscles,
    equipment: exercise.equipment,
    difficulty: exercise.difficulty,
    instructions: exercise.instructions,
    videoUrl: exercise.videoUrl ?? null,
  };
}

export function mapWorkoutExerciseToUI(workoutExercise: ApiWorkoutExercise): UIWorkoutExercise {
  return {
    id: workoutExercise.id,
    order: workoutExercise.order,
    sets: workoutExercise.sets,
    reps: workoutExercise.reps,
    durationSeconds: workoutExercise.durationSeconds,
    restSeconds: workoutExercise.restSeconds,
    notes: workoutExercise.notes,
    exercise: mapExerciseToUI(workoutExercise.exercise),
  };
}

export function mapWorkoutProgramToUI(program: WorkoutProgram): UIWorkoutProgram {
  return {
    id: program.id,
    name: program.name,
    goal: program.goal,
    level: program.level,
    durationWeeks: program.durationWeeks,
    sessionsPerWeek: program.sessionsPerWeek,
    notes: program.notes,
    summary: program.goal ?? undefined,
    exercises: (program.exercises ?? []).map(mapWorkoutExerciseToUI).sort((a, b) => a.order - b.order),
  };
}

export function mapWorkoutTemplateToUI(
  template: WorkoutTemplate
): UIWorkoutProgram {
  return {
    id: template.id,
    name: template.name ?? "תבנית אימון",
    goal: template.workoutType ?? null,
    level: mapTemplateLevel(template.level),
    durationWeeks: null,
    sessionsPerWeek: null,
    notes: template.notes,
    summary: template.notes ?? undefined,
    exercises: [],
  };
}

function mapTemplateLevel(level: number): UIWorkoutProgram["level"] {
  if (level <= 1) return "beginner";
  if (level === 2) return "intermediate";
  return "advanced";
}

