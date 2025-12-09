export interface Exercise {
  id: string;
  name: string;
  muscleGroup?: string | null;
  secondaryMuscles?: string[];
  workoutTypes?: string[];
  equipment: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  instructions: string | null;
  videoUrl?: string | null;
}

export interface WorkoutExercise {
  id: string;
  order: number;
  sets: number;
  reps: number | null;
  durationSeconds: number | null;
  restSeconds: number | null;
  notes: string | null;
  exercise: Exercise;
}