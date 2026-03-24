export type WorkoutProgram = {
  id: string;
  title: string;
  category: string;
  durationLabel: string;
  intensityLabel: string;
  isToday: boolean;
  thumbnailUrl: string;
  exercisesCount: number;
};

export type WorkoutExercise = {
  id: string;
  name: string;
  sets: number;
  reps: number;
  suggestedWeightKg: number;
  restSeconds: number;
};

export type WorkoutProgramDetails = WorkoutProgram & {
  exercises: WorkoutExercise[];
};

export type WorkoutSetLog = {
  setNumber: number;
  reps: number;
  weightKg: number;
  completed: boolean;
};

export type ActiveExerciseLog = {
  exerciseId: string;
  name: string;
  restSeconds: number;
  sets: WorkoutSetLog[];
};

export type ActiveWorkoutSession = {
  programId: string;
  startedAtLabel: string;
  restSecondsRemaining: number;
  completedSets: number;
  totalSets: number;
  exerciseLogs: ActiveExerciseLog[];
};

export type WorkoutSummary = {
  programId: string;
  completedAtLabel: string;
  totalSetsCompleted: number;
  totalVolumeKg: number;
  durationMinutes: number;
  effortLabel: string;
  nextBestActionLabel: string;
};
