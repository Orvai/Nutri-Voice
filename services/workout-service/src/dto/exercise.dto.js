const { z } = require("zod");

const GenderEnum = z.enum(["MALE", "FEMALE"]);
const BodyTypeEnum = z.enum(["ECTO", "ENDO"]);
const WorkoutTypeEnum = z.enum(["A", "B", "FBW", "UPPER", "LOWER", "GLUTES", "HIIT", "PUSH", "PULL", "LEGS"]);
const MuscleGroupEnum = z.enum(["CHEST", "BACK", "SHOULDERS", "LEGS", "GLUTES", "ARMS", "BICEPS", "TRICEPS", "ABS", "FULL_BODY"]);

const ExerciseCreateDto = z.object({
  name: z.string().min(2),
  description: z.string().optional(),
  notes: z.string().optional(),
  muscleGroup: MuscleGroupEnum,
  gender: GenderEnum.optional(),
  bodyType: BodyTypeEnum.optional(),
  workoutTypes: z.array(WorkoutTypeEnum).optional(),
  equipment: z.string().optional(),
  difficulty: z.string().optional(),
});

const ExerciseUpdateDto = z.object({
  id: z.string(),
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

const ExerciseFilterDto = z.object({
  gender: GenderEnum.optional(),
  bodyType: BodyTypeEnum.optional(),
  workoutType: WorkoutTypeEnum.optional(),
  muscleGroup: MuscleGroupEnum.optional(),
});

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
  createdAt: z.date(),
  updatedAt: z.date(),
});

module.exports = {
  GenderEnum,
  BodyTypeEnum,
  WorkoutTypeEnum,
  MuscleGroupEnum,
  ExerciseCreateDto,
  ExerciseUpdateDto,
  ExerciseFilterDto,
  ExerciseResponseDto,
};