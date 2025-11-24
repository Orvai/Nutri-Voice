// src/docs/zod-schemas.js
const { z } = require("zod");

const {
  ExerciseCreateDto,
  ExerciseUpdateDto,
  ExerciseResponseDto,
} = require("../dto/exercise.dto");
const { WorkoutTemplateResponseDto } = require("../dto/workoutTemplate.dto");
const {
  WorkoutProgramCreateRequestDto,
  WorkoutProgramUpdateRequestDto,
  WorkoutProgramResponseDto,
  WorkoutExerciseResponseDto,
} = require("../dto/workoutProgram.dto");

function toJsonSchema(dto, name) {
  const schema = z.toJSONSchema(dto, {
    unrepresentable: "any",
    override: (ctx) => {
      const def = ctx.zodSchema?._zod?.def;
      if (def && def.type === "date") {
        ctx.jsonSchema.type = "string";
        ctx.jsonSchema.format = "date-time";
      }
    },
  });

  return { title: name, ...schema };
}

/* EXERCISES */
const ExerciseCreateSchema = toJsonSchema(
  ExerciseCreateDto,
  "ExerciseCreateDto"
);
const ExerciseUpdateSchema = toJsonSchema(
  ExerciseUpdateDto,
  "ExerciseUpdateDto"
);
const ExerciseResponseSchema = toJsonSchema(
  ExerciseResponseDto,
  "ExerciseResponseDto"
);

/* WORKOUT TEMPLATES */
const WorkoutTemplateResponseSchema = toJsonSchema(
  WorkoutTemplateResponseDto,
  "WorkoutTemplateResponseDto"
);

/* WORKOUT PROGRAMS */
const WorkoutProgramCreateSchema = toJsonSchema(
  WorkoutProgramCreateRequestDto,
  "WorkoutProgramCreateRequestDto"
);
const WorkoutProgramUpdateSchema = toJsonSchema(
  WorkoutProgramUpdateRequestDto,
  "WorkoutProgramUpdateRequestDto"
);
const WorkoutProgramResponseSchema = toJsonSchema(
  WorkoutProgramResponseDto,
  "WorkoutProgramResponseDto"
);
const WorkoutExerciseResponseSchema = toJsonSchema(
  WorkoutExerciseResponseDto,
  "WorkoutExerciseResponseDto"
);

module.exports = {
  ExerciseCreateDto: ExerciseCreateSchema,
  ExerciseUpdateDto: ExerciseUpdateSchema,
  ExerciseResponseDto: ExerciseResponseSchema,

  WorkoutTemplateResponseDto: WorkoutTemplateResponseSchema,

  WorkoutProgramCreateRequestDto: WorkoutProgramCreateSchema,
  WorkoutProgramUpdateRequestDto: WorkoutProgramUpdateSchema,
  WorkoutProgramResponseDto: WorkoutProgramResponseSchema,
  WorkoutExerciseResponseDto: WorkoutExerciseResponseSchema,
};