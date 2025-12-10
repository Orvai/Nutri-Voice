import { WorkoutExercise } from "./exercise.types";

export interface WorkoutProgram {
  id: string;
  name: string;
  clientId: string;
  coachId: string;
  createdAt: string;
  updatedAt: string;
  exercises: WorkoutExercise[];
  templateMuscleGroups?: string[];
}

export interface WorkoutExerciseCreatePayload {
  exerciseId: string;
  sets: number;
  reps: string;
  weight?: number | null;
  rest?: number | null;
  order: number;
  notes?: string | null;
}

export interface WorkoutExerciseUpdatePayload
  extends Partial<WorkoutExerciseCreatePayload> {
  id: string;
}

export interface WorkoutExerciseDeletePayload {
  id: string;
}

export interface CreateWorkoutProgramPayload {
  name: string;
  clientId: string;
  coachId: string;
  templateId?: string;
  exercises?: WorkoutExerciseCreatePayload[];
}

export interface UpdateWorkoutProgramPayload {
  name?: string;
  exercisesToAdd?: WorkoutExerciseCreatePayload[];
  exercisesToUpdate?: WorkoutExerciseUpdatePayload[];
  exercisesToDelete?: WorkoutExerciseDeletePayload[];
}