const { z } = require('zod');
const { DaySelectionCreateDto, DaySelectionResponseDto } = require('../dto/daySelection.dto');
const { MealLogCreateDto, MealLogResponseDto } = require('../dto/mealLog.dto');
const {
  WorkoutLogCreateDto,
  WorkoutLogUpdateDto,
  WorkoutExerciseCreateDto,
  WorkoutExerciseUpdateDto,
  WorkoutLogResponseDto,
  WorkoutExerciseResponseDto,
  WorkoutHistoryResponseDto,
} = require('../dto/workoutLog.dto');
const { WeightLogCreateDto, WeightLogResponseDto, WeightHistoryResponseDto } = require('../dto/weightLog.dto');

function toJsonSchema(name, schema) {
  const json = z.toJSONSchema(schema, {
    unrepresentable: 'any',
    override: (ctx) => {
      const def = ctx.zodSchema?._zod?.def;
      if (def && def.type === 'date') {
        ctx.jsonSchema.type = 'string';
        ctx.jsonSchema.format = 'date-time';
      }
    },
  });
  return { title: name, ...json };
}

const schemas = {
  Tracking_DaySelectionCreateDto: DaySelectionCreateDto,
  Tracking_MealLogCreateDto: MealLogCreateDto,
  Tracking_WorkoutLogCreateDto: WorkoutLogCreateDto,
  Tracking_WorkoutLogUpdateDto: WorkoutLogUpdateDto,
  Tracking_WorkoutExerciseCreateDto: WorkoutExerciseCreateDto,
  Tracking_WorkoutExerciseUpdateDto: WorkoutExerciseUpdateDto,
  Tracking_WeightLogCreateDto: WeightLogCreateDto,

  Tracking_DaySelectionResponseDto: DaySelectionResponseDto,
  Tracking_MealLogResponseDto: MealLogResponseDto,
  Tracking_WorkoutLogResponseDto: WorkoutLogResponseDto,
  Tracking_WorkoutExerciseResponseDto: WorkoutExerciseResponseDto,
  Tracking_WorkoutHistoryResponseDto: WorkoutHistoryResponseDto,
  Tracking_WeightLogResponseDto: WeightLogResponseDto,
  Tracking_WeightHistoryResponseDto: WeightHistoryResponseDto,
};

module.exports = Object.entries(schemas).reduce((acc, [name, schema]) => {
  acc[name] = toJsonSchema(name, schema);
  return acc;
}, {});