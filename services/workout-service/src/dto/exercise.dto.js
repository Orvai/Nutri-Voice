const { z } = require("zod");
const {
  mapGenderToDb,
  mapMuscleGroupToDb,
} = require("../common/workoutLocalization");

const mappedEnum = (mapper, fieldName) =>
  z.string().transform((value, ctx) => {
    const mapped = mapper(value);
    if (!mapped) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Invalid ${fieldName}`,
      });
      return z.NEVER;
    }
    return mapped;
  });

const GenderEnum = mappedEnum(mapGenderToDb, "gender");
const BodyTypeEnum = z.enum(["ECTO", "ENDO"]);
const WorkoutTypeEnum = z.enum(["A", "B", "FBW", "UPPER", "LOWER", "GLUTES", "HIIT", "PUSH", "PULL", "LEGS"]);
const MuscleGroupEnum = mappedEnum(mapMuscleGroupToDb, "muscleGroup");

const ExerciseIdParamDto = z.object({
  id: z.string(),
}).strict();

const ExerciseCreateDto = z
  .object({
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
  })
  .strict();

const ExerciseUpdateDto = z
  .object({
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
  })
  .strict();

const ExerciseFilterDto = z
  .object({
    gender: GenderEnum.optional(),
    bodyType: BodyTypeEnum.optional(),
    workoutType: WorkoutTypeEnum.optional(),
    muscleGroup: MuscleGroupEnum.optional(),
  })
  .strict();

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
  ExerciseIdParamDto,
  ExerciseCreateDto,
  ExerciseUpdateDto,
  ExerciseFilterDto,
  ExerciseResponseDto,
};
