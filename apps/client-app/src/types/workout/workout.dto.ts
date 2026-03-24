export type WorkoutExerciseDto = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  suggestedWeightKg: number;
  restSeconds: number;
};

export type WorkoutProgramDto = {
  id: string;
  title: string;
  category: string;
  durationMinutes: number;
  intensity: "low" | "medium" | "high";
  isToday: boolean;
  thumbnailUrl: string;
  exercises: WorkoutExerciseDto[];
};

export type WorkoutSetLogDto = {
  setNumber: number;
  reps: number;
  weightKg: number;
  completed: boolean;
};

export type ActiveExerciseLogDto = {
  exerciseId: string;
  name: string;
  restSeconds: number;
  sets: WorkoutSetLogDto[];
};

export type ActiveWorkoutSessionDto = {
  programId: string;
  startedAtIso: string;
  restEndsAtIso: string | null;
  exerciseLogs: ActiveExerciseLogDto[];
};

export type WorkoutSummaryDto = {
  programId: string;
  completedAtIso: string;
  totalSetsCompleted: number;
  totalVolumeKg: number;
  durationMinutes: number;
  effortLabel: string;
  nextBestAction: "report_meal" | "hydrate";
};

export type UpdateWorkoutSetInputDto = {
  programId: string;
  exerciseId: string;
  setNumber: number;
  reps: number;
  weightKg: number;
};
