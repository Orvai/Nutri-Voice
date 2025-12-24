const { z } = require('zod');
const { DayTypeEnum } = require('./daySelection.dto');
const { MealLogResponseDto } = require('./mealLog.dto');
const { WorkoutLogResponseDto } = require('./workoutLog.dto');
const { WeightLogResponseDto } = require('./weightLog.dto');

const CalorieTargetsDto = z.object({
  trainingDay: z.number().int().nullable(),
  restDay: z.number().int().nullable()
}).strict();

const DailyStateDto = z.object({
  dayType: DayTypeEnum.nullable(),

  calorieTargets: CalorieTargetsDto,

  activeCaloriesAllowed: z.number().int().nullable(),
  consumedCalories: z.number().int(),
  remainingCalories: z.number().int().nullable(),

  meals: z.array(MealLogResponseDto),
  workouts: z.array(WorkoutLogResponseDto),
  weight: WeightLogResponseDto.nullable()
}).strict();

module.exports = { DailyStateDto };
