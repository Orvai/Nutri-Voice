/* ======================================================
   UI TYPES – WORKOUT TEMPLATE
   (UI boundary – no API / SDK imports)
====================================================== */

export type UIWorkoutTemplate = {
    id: string;
  
    /** Target population */
    gender: "MALE" | "FEMALE" | "OTHER" | string;
    level: number;
    bodyType: string | null;
  
    /** Workout definition */
    workoutType: string;
    muscleGroups: string[];
  
    /** Display / UX */
    name: string | null;
    notes: string | null;
  };
  