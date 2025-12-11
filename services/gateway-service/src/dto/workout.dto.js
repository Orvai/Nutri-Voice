const { z } = require("zod");

/* ======================================================
   ENUMS — gateway-side
====================================================== */

const GenderEnum = z.enum(["MALE", "FEMALE"]);
const BodyTypeEnum = z.enum(["ECTO", "ENDO"]);
const WorkoutTypeEnum = z.enum([
  "A",
  "B",
  "FBW",
  "UPPER",
  "LOWER",
  "GLUTES",
  "HIIT",
  "PUSH",
  "PULL",
  "LEGS",
]);
const MuscleGroupEnum = z.enum([
  "CHEST",
  "BACK",
  "SHOULDERS",
  "LEGS",
  "GLUTES",
  "ARMS",
  "BICEPS",
  "TRICEPS",
  "ABS",
  "FULL_BODY",
]);

/* ======================================================
   EXERCISES (MASTER DATA)
====================================================== */

const ExerciseCreateRequestDto = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  notes: z.string().optional(),
  videoUrl: z.string().url().optional(),
  muscleGroup: MuscleGroupEnum,
  gender: GenderEnum.optional(),
  bodyType: BodyTypeEnum.optional(),
  workoutTypes: z.array(WorkoutTypeEnum).optional(),
  equipment: z.string().optional(),
  difficulty: z.string().optional(),
});

const ExerciseUpdateRequestDto = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
  videoUrl: z.string().url().optional(),
  muscleGroup: MuscleGroupEnum.optional(),
  gender: GenderEnum.optional(),
  bodyType: BodyTypeEnum.optional(),
  workoutTypes: z.array(WorkoutTypeEnum).optional(),
  equipment: z.string().optional(),
  difficulty: z.string().optional(),
});

/** Real response schema based on service */
const ExerciseResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  notes: z.string().nullable(),
  videoUrl: z.string().nullable(),
  muscleGroup: z.string(),
  gender: z.string().nullable(),
  bodyType: z.string().nullable(),
  workoutTypes: z.array(z.string()),
  equipment: z.string().nullable(),
  difficulty: z.string().nullable(),
  createdByCoachId: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/* ======================================================
   WORKOUT TEMPLATES
====================================================== */

const WorkoutTemplateCreateRequestDto = z.object({
  gender: GenderEnum,
  level: z.number(),
  bodyType: BodyTypeEnum.nullable().optional(),
  workoutType: z.string(),
  muscleGroups: z.array(z.string()),
  name: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

const WorkoutTemplateUpdateRequestDto =
  WorkoutTemplateCreateRequestDto.partial();

/** Real template response schema */
const WorkoutTemplateResponseDto = z.object({
  id: z.string(),
  gender: GenderEnum,
  level: z.number(),
  bodyType: BodyTypeEnum.nullable(),
  workoutType: z.string(),
  muscleGroups: z.array(z.string()),
  name: z.string().nullable(),
  notes: z.string().nullable(),
});

/* ======================================================
   WORKOUT PROGRAMS
====================================================== */

const WorkoutProgramExerciseCreateDto = z.object({
  exerciseId: z.string(),
  sets: z.number().int().positive(),
  reps: z.string(),
  weight: z.number().nullable().optional(),
  rest: z.number().int().nullable().optional(),
  order: z.number().int().nonnegative(),
  notes: z.string().nullable().optional(),
});

const WorkoutProgramExerciseUpdateDto = z.object({
  id: z.string(),
  exerciseId: z.string().optional(),
  sets: z.number().optional(),
  reps: z.string().optional(),
  weight: z.number().nullable().optional(),
  rest: z.number().nullable().optional(),
  order: z.number().optional(),
  notes: z.string().nullable().optional(),
});

const WorkoutProgramExerciseDeleteDto = z.object({
  id: z.string(),
});

/** FULL create DTO to match service */
const WorkoutProgramCreateRequestDto = z.object({
  name: z.string().min(2),
  clientId: z.string(),
  coachId: z.string(),
  templateId: z.string().optional(),
  exercises: z.array(WorkoutProgramExerciseCreateDto).optional().default([]),
});

/** FULL update DTO */
const WorkoutProgramUpdateRequestDto = z.object({
  name: z.string().optional(),
  exercisesToAdd: z.array(WorkoutProgramExerciseCreateDto).optional(),
  exercisesToUpdate: z.array(WorkoutProgramExerciseUpdateDto).optional(),
  exercisesToDelete: z.array(WorkoutProgramExerciseDeleteDto).optional(),
});

/** Exercise instance response */
const WorkoutExerciseResponseDto = z.object({
  id: z.string(),
  programId: z.string(),
  exerciseId: z.string(),
  sets: z.number(),
  reps: z.string(),
  weight: z.number().nullable(),
  rest: z.number().nullable(),
  order: z.number(),
  notes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/** Full program response */
const WorkoutProgramResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  clientId: z.string(),
  coachId: z.string(),
  templateId: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  exercises: z.array(WorkoutExerciseResponseDto),
});

/* ======================================================
   EXPORT
====================================================== */

module.exports = {
  GenderEnum,
  BodyTypeEnum,
  WorkoutTypeEnum,
  MuscleGroupEnum,

  // Exercises
  ExerciseCreateRequestDto,
  ExerciseUpdateRequestDto,
  ExerciseResponseDto,

  // Workout Templates
  WorkoutTemplateCreateRequestDto,
  WorkoutTemplateUpdateRequestDto,
  WorkoutTemplateResponseDto,

  // Workout Programs
  WorkoutProgramExerciseCreateDto,
  WorkoutProgramExerciseUpdateDto,
  WorkoutProgramExerciseDeleteDto,
  WorkoutProgramCreateRequestDto,
  WorkoutProgramUpdateRequestDto,
  WorkoutProgramResponseDto,
};
