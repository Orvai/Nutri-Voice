import type {
  WorkoutTemplateCreateRequestDtoBodyType,
} from "@common/api/sdk/schemas";

/* ======================
   BodyType
====================== */

export const BODY_TYPE_LABEL_TO_ENUM: Record<
  string,
  WorkoutTemplateCreateRequestDtoBodyType
> = {
  ECTO: "ECTO",
  ENDO: "ENDO",
};

/* ======================
   Hebrew Enums
====================== */

export const CANONICAL_GENDER_VALUES = ["זכר", "נקבה"] as const;

export const CANONICAL_MUSCLE_GROUP_VALUES = [
  "חזה",
  "גב",
  "כתפיים",
  "רגליים",
  "ישבן",
  "ידיים",
  "יד קדמית",
  "יד אחורית",
  "בטן",
  "גוף מלא",
] as const;

export const EXERCISE_NAME_TO_HEBREW: Record<string, string> = {
  "Bench Press": "לחיצת חזה",
  "Incline Dumbbell Press": "לחיצת חזה בשיפוע עם משקולות",
  "Lat Pulldown": "משיכת פולי עליון",
  "Barbell Row": "חתירה במוט",
  "Shoulder Press": "לחיצת כתפיים",
  Squat: "סקוואט",
  "Leg Press": "לחיצת רגליים",
  "Glute Bridge": "גשר ישבן",
  "Bicep Curl": "כפיפת מרפקים",
  "Tricep Rope Pushdown": "פשיטת מרפקים בכבל",
};

export const GENDER_LABEL_TO_CANONICAL: Record<string, string> = {
  זכר: "זכר",
  נקבה: "נקבה",
  MALE: "זכר",
  FEMALE: "נקבה",
  male: "זכר",
  female: "נקבה",
};

export const MUSCLE_LABEL_TO_ENUM: Record<string, string> = {
  חזה: "חזה",
  גב: "גב",
  כתפיים: "כתפיים",
  רגליים: "רגליים",
  ישבן: "ישבן",
  ידיים: "ידיים",
  "יד קדמית": "יד קדמית",
  "יד אחורית": "יד אחורית",
  בטן: "בטן",
  "גוף מלא": "גוף מלא",

  CHEST: "חזה",
  BACK: "גב",
  SHOULDERS: "כתפיים",
  LEGS: "רגליים",
  GLUTES: "ישבן",
  ARMS: "ידיים",
  BICEPS: "יד קדמית",
  TRICEPS: "יד אחורית",
  ABS: "בטן",
  FULL_BODY: "גוף מלא",

  chest: "חזה",
  back: "גב",
  shoulders: "כתפיים",
  legs: "רגליים",
  glutes: "ישבן",
  arms: "ידיים",
  biceps: "יד קדמית",
  triceps: "יד אחורית",
  abs: "בטן",
  full_body: "גוף מלא",

  יד_קדמית: "יד קדמית",
  יד_אחורית: "יד אחורית",
  גוף_מלא: "גוף מלא",
};

const normalize = (value?: string | null) => (value ?? "").trim();

export function normalizeGender(value?: string | null): string {
  const clean = normalize(value);
  if (!clean) return "";
  return (
    GENDER_LABEL_TO_CANONICAL[clean] ??
    GENDER_LABEL_TO_CANONICAL[clean.toUpperCase()] ??
    clean
  );
}

export function normalizeMuscleGroup(value?: string | null): string {
  const clean = normalize(value);
  if (!clean) return "";
  return (
    MUSCLE_LABEL_TO_ENUM[clean] ??
    MUSCLE_LABEL_TO_ENUM[clean.toUpperCase()] ??
    clean
  );
}

export function normalizeExerciseName(value?: string | null): string {
  const clean = normalize(value);
  if (!clean) return "";
  return EXERCISE_NAME_TO_HEBREW[clean] ?? clean;
}
