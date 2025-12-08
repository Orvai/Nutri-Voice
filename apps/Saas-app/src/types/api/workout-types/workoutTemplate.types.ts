export type Gender = "MALE" | "FEMALE";

export type BodyType = "ECTO" | "ENDO";

export type WorkoutType =
  | "A"
  | "B"
  | "FBW"
  | "UPPER"
  | "LOWER"
  | "GLUTES"
  | "HIIT"
  | "PUSH"
  | "PULL"
  | "LEGS";

export type MuscleGroup =
  | "CHEST"
  | "BACK"
  | "SHOULDERS"
  | "LEGS"
  | "GLUTES"
  | "ARMS"
  | "BICEPS"
  | "TRICEPS"
  | "ABS"
  | "FULL_BODY";

export interface WorkoutTemplate {
  id: string;
  gender: Gender;
  level: number;
  bodyType: BodyType | null;
  workoutType: WorkoutType;
  muscleGroups: MuscleGroup[];
  name: string | null;
  notes: string | null;
}
