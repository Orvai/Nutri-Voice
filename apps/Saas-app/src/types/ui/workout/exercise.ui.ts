// src/types/ui/workout/exercise.ui.ts

export interface UIExercise {
    id: string;
    name: string;
    muscleGroup: string;
    equipment?: string | null;
    videoUrl?: string | null;
  }