import { WorkoutExercise } from "./exercise.types";

export interface WorkoutProgram {
  id: string;
  name: string;
  goal: string | null;
  level: "beginner" | "intermediate" | "advanced";
  durationWeeks: number | null;
  sessionsPerWeek: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  exercises: WorkoutExercise[];
}

export interface CreateWorkoutProgramPayload {
  name: string;
  goal?: string | null;
  level?: "beginner" | "intermediate" | "advanced";
  durationWeeks?: number | null;
  sessionsPerWeek?: number | null;
  notes?: string | null;
  exercises?: Array<{
    exerciseId: string;
    sets: number;
    reps?: number | null;
    durationSeconds?: number | null;
    restSeconds?: number | null;
    notes?: string | null;
    order?: number;
  }>;
}

export interface UpdateWorkoutProgramPayload extends Partial<CreateWorkoutProgramPayload> {}