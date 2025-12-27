import { z } from "zod";

/**
 * ===== Sub DTOs (Tool-level, AI-friendly)
 */
const MetricsToolDto = z.object({
  id: z.string(),
  date: z.string(),
  steps: z.number().nullable(),
  waterLiters: z.number().nullable(),
  sleepHours: z.number().nullable(),
  notes: z.string().nullable(),
  updatedAt: z.string()
});
const MealToolDto = z.object({
  id: z.string(),
  date: z.string(),               // ISO date
  calories: z.number(),

  description: z.string().nullable(),
  matchedMenuItemId: z.string().nullable(),

  loggedAt: z.string().nullable(),
});

const WorkoutExerciseToolDto = z.object({
  id: z.string(),
  exerciseName: z.string(),
  weight: z.number().nullable(),
});

const WorkoutToolDto = z.object({
  id: z.string(),
  date: z.string(),

  workoutType: z.string(),
  effortLevel: z.string(),

  notes: z.string().nullable(),
  loggedAt: z.string().nullable(),

  exercises: z.array(WorkoutExerciseToolDto),
});

const WeightToolDto = z.object({
  id: z.string(),
  date: z.string(),
  weightKg: z.number(),
  notes: z.string().nullable(),
});

/**
 * ===== Daily State (Tool DTO)
 */
export const DailyStateToolDto = z.object({
  dayType: z.enum(["TRAINING", "REST"]).nullable(),

  calorieTargets: z.object({
    trainingDay: z.number().int().nullable(),
    restDay: z.number().int().nullable(),
  }),

  activeCaloriesAllowed: z.number().int().nullable(),
  consumedCalories: z.number().int(),
  remainingCalories: z.number().int().nullable(),

  meals: z.array(MealToolDto),
  workouts: z.array(WorkoutToolDto),
  weight: WeightToolDto.nullable(),
  metrics: MetricsToolDto.nullable(), 
});

