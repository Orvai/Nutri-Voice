const GENDER_DB_TO_HEBREW = {
  MALE: "זכר",
  FEMALE: "נקבה",
};

const MUSCLE_GROUP_DB_TO_HEBREW = {
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
};

const EXERCISE_NAME_TO_HEBREW = {
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

const GENDER_TO_DB = {
  MALE: "MALE",
  FEMALE: "FEMALE",
  male: "MALE",
  female: "FEMALE",
  זכר: "MALE",
  נקבה: "FEMALE",
  גבר: "MALE",
  אישה: "FEMALE",
  אשה: "FEMALE",
};

const MUSCLE_GROUP_TO_DB = {
  CHEST: "CHEST",
  BACK: "BACK",
  SHOULDERS: "SHOULDERS",
  LEGS: "LEGS",
  GLUTES: "GLUTES",
  ARMS: "ARMS",
  BICEPS: "BICEPS",
  TRICEPS: "TRICEPS",
  ABS: "ABS",
  FULL_BODY: "FULL_BODY",

  chest: "CHEST",
  back: "BACK",
  shoulders: "SHOULDERS",
  legs: "LEGS",
  glutes: "GLUTES",
  arms: "ARMS",
  biceps: "BICEPS",
  triceps: "TRICEPS",
  abs: "ABS",
  full_body: "FULL_BODY",
  "full body": "FULL_BODY",

  חזה: "CHEST",
  גב: "BACK",
  כתפיים: "SHOULDERS",
  רגליים: "LEGS",
  ישבן: "GLUTES",
  ידיים: "ARMS",
  "יד קדמית": "BICEPS",
  "יד_קדמית": "BICEPS",
  "יד אחורית": "TRICEPS",
  "יד_אחורית": "TRICEPS",
  בטן: "ABS",
  "גוף מלא": "FULL_BODY",
  "גוף_מלא": "FULL_BODY",
};

const normalizeLookupValue = (value) => {
  if (typeof value !== "string") return "";
  return value.trim();
};

const mapGenderToDb = (value) => {
  const normalized = normalizeLookupValue(value);
  if (!normalized) return null;
  return GENDER_TO_DB[normalized] ?? GENDER_TO_DB[normalized.toUpperCase()] ?? null;
};

const mapMuscleGroupToDb = (value) => {
  const normalized = normalizeLookupValue(value);
  if (!normalized) return null;
  return (
    MUSCLE_GROUP_TO_DB[normalized] ??
    MUSCLE_GROUP_TO_DB[normalized.toUpperCase()] ??
    null
  );
};

const toHebrewGender = (value) => {
  if (value == null) return null;
  const normalized = normalizeLookupValue(value);
  return GENDER_DB_TO_HEBREW[normalized] ?? normalized;
};

const toHebrewMuscleGroup = (value) => {
  if (value == null) return null;
  const normalized = normalizeLookupValue(value);
  return MUSCLE_GROUP_DB_TO_HEBREW[normalized] ?? normalized;
};

const toHebrewExerciseName = (value) => {
  if (typeof value !== "string") return value;
  const normalized = value.trim();
  return EXERCISE_NAME_TO_HEBREW[normalized] ?? value;
};

const localizeExercise = (exercise) => {
  if (!exercise) return exercise;
  return {
    ...exercise,
    name: toHebrewExerciseName(exercise.name),
    muscleGroup: toHebrewMuscleGroup(exercise.muscleGroup),
    gender: toHebrewGender(exercise.gender),
  };
};

const localizeTemplate = (template) => {
  if (!template) return template;
  return {
    ...template,
    gender: toHebrewGender(template.gender),
    muscleGroups: Array.isArray(template.muscleGroups)
      ? template.muscleGroups.map(toHebrewMuscleGroup)
      : template.muscleGroups,
  };
};

const localizeProgram = (program) => {
  if (!program) return program;
  return {
    ...program,
    template: localizeTemplate(program.template),
    exercises: Array.isArray(program.exercises)
      ? program.exercises.map((programExercise) => ({
          ...programExercise,
          exercise: localizeExercise(programExercise.exercise),
        }))
      : program.exercises,
  };
};

module.exports = {
  mapGenderToDb,
  mapMuscleGroupToDb,
  toHebrewGender,
  toHebrewMuscleGroup,
  toHebrewExerciseName,
  localizeExercise,
  localizeTemplate,
  localizeProgram,
};
