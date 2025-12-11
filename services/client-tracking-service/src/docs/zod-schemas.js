// src/docs/zod-schemas.js
const { z } = require("zod");

// === Request DTOs ===
const { DaySelectionCreateDto, DaySelectionResponseDto } = require("../dto/daySelection.dto");
const { MealLogCreateDto, MealLogResponseDto } = require("../dto/mealLog.dto");

const {
  WorkoutLogCreateDto,
  WorkoutLogUpdateDto,
  WorkoutExerciseCreateDto,
  WorkoutExerciseUpdateDto,
  WorkoutLogResponseDto,
  WorkoutExerciseResponseDto,
  WorkoutHistoryResponseDto
} = require("../dto/workoutLog.dto");

const {
  WeightLogCreateDto,
  WeightLogResponseDto,
  WeightHistoryResponseDto
} = require("../dto/weightLog.dto");


// JSON Schema generator
function toJsonSchema(dto, name) {
  const schema = z.toJSONSchema(dto, {
    unrepresentable: "any",
    override: (ctx) => {
      const def = ctx.zodSchema?._zod?.def;
      if (def && def.type === "date") {
        ctx.jsonSchema.type = "string";
        ctx.jsonSchema.format = "date-time";
      }
    }
  });

  return { title: name, ...schema };
}

// ==========================
// REQUEST SCHEMAS
// ==========================

const DaySelectionCreateSchema = toJsonSchema(DaySelectionCreateDto, "DaySelectionCreateDto");
const MealLogCreateSchema = toJsonSchema(MealLogCreateDto, "MealLogCreateDto");

const WorkoutLogCreateSchema = toJsonSchema(WorkoutLogCreateDto, "WorkoutLogCreateDto");
const WorkoutLogUpdateSchema = toJsonSchema(WorkoutLogUpdateDto, "WorkoutLogUpdateDto");
const WorkoutExerciseCreateSchema = toJsonSchema(
  WorkoutExerciseCreateDto,
  "WorkoutExerciseCreateDto"
);
const WorkoutExerciseUpdateSchema = toJsonSchema(
  WorkoutExerciseUpdateDto,
  "WorkoutExerciseUpdateDto"
);

const WeightLogCreateSchema = toJsonSchema(WeightLogCreateDto, "WeightLogCreateDto");

// ==========================
// RESPONSE SCHEMAS (NEW!)
// ==========================

const DaySelectionResponseSchema = toJsonSchema(
  DaySelectionResponseDto,
  "DaySelectionResponseDto"
);

const MealLogResponseSchema = toJsonSchema(MealLogResponseDto, "MealLogResponseDto");

const WorkoutLogResponseSchema = toJsonSchema(WorkoutLogResponseDto, "WorkoutLogResponseDto");
const WorkoutExerciseResponseSchema = toJsonSchema(
  WorkoutExerciseResponseDto,
  "WorkoutExerciseResponseDto"
);
const WorkoutHistoryResponseSchema = toJsonSchema(
  WorkoutHistoryResponseDto,
  "WorkoutHistoryResponseDto"
);

const WeightLogResponseSchema = toJsonSchema(WeightLogResponseDto, "WeightLogResponseDto");
const WeightHistoryResponseSchema = toJsonSchema(
  WeightHistoryResponseDto,
  "WeightHistoryResponseDto"
);

// ==========================
// EXPORT TO SWAGGER
// ==========================
module.exports = {
  // REQUEST DTOs
  DaySelectionCreateDto: DaySelectionCreateSchema,
  MealLogCreateDto: MealLogCreateSchema,

  WorkoutLogCreateDto: WorkoutLogCreateSchema,
  WorkoutLogUpdateDto: WorkoutLogUpdateSchema,
  WorkoutExerciseCreateDto: WorkoutExerciseCreateSchema,
  WorkoutExerciseUpdateDto: WorkoutExerciseUpdateSchema,

  WeightLogCreateDto: WeightLogCreateSchema,

  // RESPONSE DTOs (NEW)
  DaySelectionResponseDto: DaySelectionResponseSchema,
  MealLogResponseDto: MealLogResponseSchema,

  WorkoutLogResponseDto: WorkoutLogResponseSchema,
  WorkoutExerciseResponseDto: WorkoutExerciseResponseSchema,
  WorkoutHistoryResponseDto: WorkoutHistoryResponseSchema,

  WeightLogResponseDto: WeightLogResponseSchema,
  WeightHistoryResponseDto: WeightHistoryResponseSchema,
};
