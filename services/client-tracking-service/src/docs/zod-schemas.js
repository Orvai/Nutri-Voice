// src/docs/zod-schemas.js
const { z } = require('zod');
const { DaySelectionCreateDto } = require('../dto/daySelection.dto');
const { MealLogCreateDto } = require('../dto/mealLog.dto');
const {
  WorkoutLogCreateDto,
  WorkoutLogUpdateDto,
  WorkoutExerciseCreateDto,
  WorkoutExerciseUpdateDto
} = require('../dto/workoutLog.dto');
const { WeightLogCreateDto } = require('../dto/weightLog.dto');

function toJsonSchema(dto, name) {
  const schema = z.toJSONSchema(dto, {
    unrepresentable: 'any',
    override: (ctx) => {
      const def = ctx.zodSchema?._zod?.def;
      if (def && def.type === 'date') {
        ctx.jsonSchema.type = 'string';
        ctx.jsonSchema.format = 'date-time';
      }
    }
  });

  return { title: name, ...schema };
}

const DaySelectionCreateSchema = toJsonSchema(DaySelectionCreateDto, 'DaySelectionCreateDto');
const MealLogCreateSchema = toJsonSchema(MealLogCreateDto, 'MealLogCreateDto');

// 🟦 NEW — Workout Log Schemas:
const WorkoutLogCreateSchema = toJsonSchema(WorkoutLogCreateDto, 'WorkoutLogCreateDto');
const WorkoutLogUpdateSchema = toJsonSchema(WorkoutLogUpdateDto, 'WorkoutLogUpdateDto');
const WorkoutExerciseCreateSchema = toJsonSchema(
  WorkoutExerciseCreateDto,
  'WorkoutExerciseCreateDto'
);
const WorkoutExerciseUpdateSchema = toJsonSchema(
  WorkoutExerciseUpdateDto,
  'WorkoutExerciseUpdateDto'
);

const WeightLogCreateSchema = toJsonSchema(WeightLogCreateDto, 'WeightLogCreateDto');


module.exports = {
  DaySelectionCreateDto: DaySelectionCreateSchema,
  MealLogCreateDto: MealLogCreateSchema,

  // 🆕 Export the schemas for Swagger:
  WorkoutLogCreateDto: WorkoutLogCreateSchema,
  WorkoutLogUpdateDto: WorkoutLogUpdateSchema,
  WorkoutExerciseCreateDto: WorkoutExerciseCreateSchema,
  WorkoutExerciseUpdateDto: WorkoutExerciseUpdateSchema,

  WeightLogCreateDto: WeightLogCreateSchema,
};
