const { z } = require("zod");

/* ============================================
   DAY SELECTION
============================================ */

const DayTypeEnum = z.enum(['TRAINING', 'REST']);

const DaySelectionCreateRequestDto = z.object({
  dayType: DayTypeEnum,
  date: z.string().datetime().optional(),
});

const DaySelectionResponseDto = z.object({
  data: z.object({
    id: z.string(),
    clientId: z.string(),
    date: z.string().datetime(),
    dayType: DayTypeEnum,
    changedAt: z.string().datetime(),
  }),
});


/* ============================================
   MEAL LOG
============================================ */

const MealLogCreateRequestDto = z.object({
  date: z.string().datetime().optional(),
  calories: z.number().int(),
  protein: z.number().int(),
  carbs: z.number().int(),
  fat: z.number().int(),
  description: z.string().optional(),
  matchedMenuItemId: z.string().optional(),
  dayType: DayTypeEnum,
});

const MealLogResponseDto = z.object({
  data: z.object({
    id: z.string(),
    clientId: z.string(),
    date: z.string().datetime(),
    dayType:DayTypeEnum,
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    description: z.string().nullable(),
    matchedMenuItemId: z.string().nullable(),
    loggedAt: z.string().datetime().optional(),
  }),
});

const MealLogUpdateRequestDto = z.object({
  calories: z.number().int().optional(),
  protein: z.number().int().optional(),
  carbs: z.number().int().optional(),
  fat: z.number().int().optional(),
  description: z.string().optional(),
  matchedMenuItemId: z.string().nullable().optional(),
  dayType: DayTypeEnum.optional(),
});


/* ============================================
   WORKOUT LOG (Create + Update)
============================================ */

const EffortLevelEnum = z.enum([
  "EASY",
  "NORMAL",
  "HARD",
  "FAILED",
  "SKIPPED",
]);

const WorkoutExerciseCreateDto = z.object({
  exerciseName: z.string().min(1),
  weight: z.number().nullable().optional(),
});

const WorkoutLogCreateRequestDto = z.object({
  date: z.string().datetime().optional(),
  workoutType: z.string().min(1),
  effortLevel: EffortLevelEnum,
  notes: z.string().optional(),
  exercises: z.array(WorkoutExerciseCreateDto),
});

const WorkoutExerciseUpdateDto = z.object({
  id: z.string(),
  exerciseName: z.string().min(1),
  weight: z.number().nullable().optional(),
});

const WorkoutLogUpdateRequestDto = z.object({
  workoutType: z.string().optional(),
  effortLevel: EffortLevelEnum.optional(),
  notes: z.string().optional(),
  exercises: z.array(WorkoutExerciseUpdateDto).optional(),
});

const WorkoutLogResponseDto = z.object({
  data: z.object({
    id: z.string(),
    clientId: z.string(),
    date: z.string().datetime(),
    workoutType: z.string(),
    effortLevel: EffortLevelEnum,
    notes: z.string().nullable(),
    loggedAt: z.string().datetime().optional(),
    exercises: z.array(
      z.object({
        id: z.string(),
        workoutLogId: z.string(),
        exerciseName: z.string(),
        weight: z.number().nullable(),
      })
    ),
  }),
});


/* ============================================
   WEIGHT LOG
============================================ */

const WeightLogCreateRequestDto = z.object({
  date: z.string().datetime().optional(),
  weightKg: z.number(),
  notes: z.string().optional(),
});

const WeightLogResponseDto = z.object({
  data: z.object({
    id: z.string(),
    clientId: z.string(),
    date: z.string().datetime(),
    weightKg: z.number(),
    notes: z.string().nullable(),
  }),
});
const WeightLogUpdateRequestDto = z.object({
  weightKg: z.number().optional(),
  notes: z.string().nullable().optional(),
});


/* ============================================
   HISTORY (coach)
============================================ */

const MealLogHistoryResponseDto = z.object({
  data: z.array(MealLogResponseDto.shape.data),
});

const WorkoutLogHistoryResponseDto = z.object({
  data: z.array(WorkoutLogResponseDto.shape.data),
});

const WeightHistoryResponseDto = z.object({
  data: z.array(WeightLogResponseDto.shape.data),
});

const DaySelectionTodayResponseDto = z.object({
  data: DaySelectionResponseDto.shape.data,
});

/* ============================================
   DAILY STATE
============================================ */

/**
 * Calorie targets per day type
 */
const CalorieTargetsDto = z.object({
  trainingDay: z.number().int().nullable(),
  restDay: z.number().int().nullable(),
});

const MetricsLogCreateDto = z.object({
  date: z.preprocess((arg) => (typeof arg === "string" ? new Date(arg) : arg), z.date()).optional(),
  steps: z.number().int().min(0).optional(),
  waterLiters: z.number().min(0).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  notes: z.string().optional()
}).strict();

const MetricsLogResponseDto = z.object({
  id: z.string(),
  clientId: z.string(),
  date: z.date(),
  steps: z.number().nullable(),
  waterLiters: z.number().nullable(),
  sleepHours: z.number().nullable(),
  notes: z.string().nullable(),
  updatedAt: z.date()
});


/**
 * Daily aggregated tracking state
 */
const DailyStateResponseDto = z.object({
  data: z.object({
    dayType: DayTypeEnum.nullable(),

    calorieTargets: CalorieTargetsDto,

    activeCaloriesAllowed: z.number().int().nullable(),
    consumedCalories: z.number().int(),
    remainingCalories: z.number().int().nullable(),

    meals: z.array(MealLogResponseDto.shape.data),
    workouts: z.array(WorkoutLogResponseDto.shape.data),
    weight: WeightLogResponseDto.shape.data.nullable(),
    metrics: MetricsLogResponseDto.nullable(),

  }),
});



/* ============================================
   EXPORT
============================================ */

module.exports = {
  DayTypeEnum,
  DaySelectionCreateRequestDto,
  DaySelectionResponseDto,

  MealLogCreateRequestDto,
  MealLogResponseDto,
  MealLogUpdateRequestDto,

  WorkoutLogCreateRequestDto,
  WorkoutLogUpdateRequestDto,
  WorkoutLogResponseDto,
  WorkoutExerciseUpdateDto,

  WeightLogCreateRequestDto,
  WeightLogResponseDto,
  WeightLogUpdateRequestDto,

  MealLogHistoryResponseDto,
  WorkoutLogHistoryResponseDto,
  WeightHistoryResponseDto,
  DaySelectionTodayResponseDto,

  DailyStateResponseDto,
  MetricsLogCreateDto,
  MetricsLogResponseDto,
};
