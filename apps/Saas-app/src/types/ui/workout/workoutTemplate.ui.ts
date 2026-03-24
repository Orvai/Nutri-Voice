/* ======================================================
   UI TYPES – WORKOUT TEMPLATE
   (UI boundary – no API / SDK imports)
====================================================== */

export type UIWorkoutTemplate = {
  id: string;

  /** Target population */
  gender: "זכר" | "נקבה" | string;
  level: number;
  bodyType: string | null;

  /** Workout definition */
  workoutType: string;
  muscleGroups: string[];

  /** Display / UX */
  name: string | null;
  notes: string | null;
};
