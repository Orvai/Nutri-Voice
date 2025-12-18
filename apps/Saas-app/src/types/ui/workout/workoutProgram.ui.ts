export interface UIWorkoutExercise {
    id: string;
    exerciseId: string;
    name: string;
    muscleGroup: string;
    sets: number;
    reps: string;
    weight: number | null;
    rest: number | null;
    order: number;
    notes: string | null;
  }
  
  export interface UIWorkoutProgram {
    id: string;
    name: string;
    clientId: string;
    coachId: string;
    templateId?: string | null;
    notes?: string | null;
    exercises: UIWorkoutExercise[];
    createdAt: string;
    updatedAt: string;
  }
  