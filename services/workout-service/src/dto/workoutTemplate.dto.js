const { z } = require("zod");
const {
  GenderEnum,
  BodyTypeEnum,
  WorkoutTypeEnum,
  MuscleGroupEnum,
} = require("./exercise.dto");

const WorkoutTemplateIdParamDto = z.object({
  id: z.string(),
}).strict();

const WorkoutTemplateQueryDto = z
  .object({
    gender: GenderEnum.optional(),
    bodyType: BodyTypeEnum.optional(),
    workoutType: WorkoutTypeEnum.optional(),
    level: z.coerce.number().int().positive().optional(),
  })
  .strict();

const WorkoutTemplateCreateDto = z
  .object({
    gender: GenderEnum,
    level: z.number().int().positive(),
    bodyType: BodyTypeEnum.nullable().optional(),
    workoutType: WorkoutTypeEnum,
    muscleGroups: z.array(MuscleGroupEnum),
    name: z.string().optional(),
    notes: z.string().optional(),
  })
  .strict();

const WorkoutTemplateUpdateDto = z
  .object({
    gender: GenderEnum.optional(),
    level: z.number().int().positive().optional(),
    bodyType: BodyTypeEnum.nullable().optional(),
    workoutType: WorkoutTypeEnum.optional(),
    muscleGroups: z.array(MuscleGroupEnum).optional(),
    name: z.string().optional(),
    notes: z.string().optional(),
  })
  .strict();

const WorkoutTemplateResponseDto = z
  .object({
    id: z.string(),
    gender: z.enum(["MALE", "FEMALE"]),
    level: z.number(),
    bodyType: z.enum(["ECTO", "ENDO"]).nullable(),
    workoutType: z.string(),
    muscleGroups: z.array(z.string()),
    name: z.string().nullable(),
    notes: z.string().nullable(),
  })
  .strict();

module.exports = {
  WorkoutTemplateIdParamDto,
  WorkoutTemplateQueryDto,
  WorkoutTemplateCreateDto,
  WorkoutTemplateUpdateDto,
  WorkoutTemplateResponseDto,
};
