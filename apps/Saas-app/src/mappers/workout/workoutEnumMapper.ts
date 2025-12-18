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
     MuscleGroup
  ====================== */
  
  export const MUSCLE_LABEL_TO_ENUM: Record<string, string> = {
    חזה: "CHEST",
    גב: "BACK",
    כתפיים: "SHOULDERS",
    רגליים: "LEGS",
    ישבן: "GLUTES",
    ידיים: "ARMS",
    יד_קדמית: "BICEPS",
    יד_אחורית: "TRICEPS",
    בטן: "ABS",
    גוף_מלא: "FULL_BODY",
  };
  