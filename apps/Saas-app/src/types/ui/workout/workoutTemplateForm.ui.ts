export type UIWorkoutTemplateFormPayload = {
    name?: string | null;
    notes?: string | null;
  
    gender: string;
    level: number;
    bodyType?: string | null;
  
    workoutType: string;
    muscleGroups: string[];
  
    exercises: {
      exerciseId: string;
      sets: number;
      reps: number;
      rest: number;
    }[];
  };
  