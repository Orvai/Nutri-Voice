const { z } = require("zod");

/* ============================================
   DAY SELECTION
============================================ */

const DayTypeEnum = z.enum(["LOW", "HIGH", "MEDIUM", "REST"]);

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
    dayType: z.enum(["LOW", "HIGH", "MEDIUM", "REST"]),
    calories: z.number(),
    protein: z.number(),
    carbs: z.number(),
    fat: z.number(),
    description: z.string().nullable(),
    matchedMenuItemId: z.string().nullable(),
    loggedAt: z.string().datetime().optional(),
  }),
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
   EXPORT
============================================ */

module.exports = {
  DayTypeEnum,
  DaySelectionCreateRequestDto,
  DaySelectionResponseDto,

  MealLogCreateRequestDto,
  MealLogResponseDto,

  WorkoutLogCreateRequestDto,
  WorkoutLogUpdateRequestDto,
  WorkoutLogResponseDto,
  WorkoutExerciseUpdateDto,

  WeightLogCreateRequestDto,
  WeightLogResponseDto,

  MealLogHistoryResponseDto,
  WorkoutLogHistoryResponseDto,
  WeightHistoryResponseDto,
  DaySelectionTodayResponseDto,
};
