import type { UIExercise } from "./exercise.ui";

/**
 * Exercise as it appears inside a Workout / Program / Template
 * (execution context, not catalog)
 */
export interface UIWorkoutExercise {
  /** Unique ID of the workout-exercise relation */
  id: string;

  /** Order of execution inside the workout */
  order: number;

  /** Base exercise (catalog entity) */
  exercise: UIExercise;

  /** Execution parameters */
  sets: number;
  reps?: number | null;
  durationSeconds?: number | null;
  restSeconds?: number | null;

  /** Coach / template notes */
  notes?: string | null;
}
