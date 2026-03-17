import { z } from "zod";

const DayTypeEnum = z.enum(["TRAINING", "REST"]);

const MealCandidateSchema = z.object({
  calories: z.number().int(),
  protein: z.number().int(),
  carbs: z.number().int(),
  fat: z.number().int(),
  dayType: DayTypeEnum.optional(),
  description: z.string().optional(),
  matchedMenuItemId: z.string().optional(),
  source: z.enum(["MENU_MATCH", "ESTIMATE", "USER_PROVIDED"]).default("ESTIMATE"),
  confidence: z.number().min(0).max(1).optional(),
  isEstimated: z.boolean().default(true),
  outsideMenu: z.boolean().default(false),
  portionText: z.string().optional(),
}).strict();

const MealUpdateSchema = z.object({
  logId: z.string().min(1),
  calories: z.number().int().optional(),
  protein: z.number().int().optional(),
  carbs: z.number().int().optional(),
  fat: z.number().int().optional(),
  dayType: DayTypeEnum.optional(),
  description: z.string().optional(),
  matchedMenuItemId: z.string().nullable().optional(),
}).strict();

const WorkoutCandidateSchema = z.object({
  workoutType: z.string().min(1),
  effortLevel: z.enum(["EASY", "NORMAL", "HARD", "FAILED", "SKIPPED"]),
  exercises: z.array(
    z.object({
      exerciseName: z.string().min(1),
      weight: z.number().nullable().optional(),
    }).strict()
  ).min(1),
  date: z.string().datetime().optional(),
  notes: z.string().optional(),
  durationMin: z.number().int().positive().optional(),
  intensity: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
  performedAsPlanned: z.boolean().optional(),
  caloriesBurnEstimate: z.number().int().nonnegative().optional(),
}).strict();

const WorkoutUpdateSchema = z.object({
  toolName: z.enum(["update_workout", "update_workout_exercise"]),
  payload: z.object({}).passthrough(),
}).strict();

const AwaitingMissingFieldsSchema = z.object({
  actionType: z.enum([
    "report_meal",
    "update_meal",
    "report_workout",
    "update_workout",
    "update_workout_exercise",
  ]),
  missingFields: z.array(z.string()).default([]),
  draftPayload: z.object({}).passthrough().optional(),
}).strict();

const LastMenuCheckSchema = z.object({
  dayType: DayTypeEnum.optional(),
  inMenu: z.boolean().nullable().optional(),
  likelyMatch: z.string().nullable().optional(),
  mismatchReason: z.string().nullable().optional(),
  queryFoodText: z.string().optional(),
}).strict();

const LastCalorieEstimateSchema = z.object({
  queryFoodText: z.string().optional(),
  estimatedCalories: z.number().int().nullable().optional(),
  portionAssumption: z.string().nullable().optional(),
  confidence: z.number().min(0).max(1).nullable().optional(),
  inMenu: z.boolean().nullable().optional(),
  matchedMenuItem: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
  }).optional(),
  outsideMenu: z.boolean().optional(),
}).strict();

const LastWorkoutContextSchema = z.object({
  programId: z.string().optional(),
  programName: z.string().optional(),
  workoutDay: z.string().nullable().optional(),
  completionStatus: z.enum(["UNKNOWN", "NOT_REPORTED", "PARTIAL", "DONE"]).optional(),
  exerciseCount: z.number().int().nonnegative().optional(),
  expectedExercises: z.array(z.string()).optional(),
  availablePrograms: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
    }).strict()
  ).optional(),
}).strict();

const ResolvedDayTypeSchema = z.object({
  dayType: DayTypeEnum,
  source: z.enum(["TOOL_DAILY_STATE", "SET_DAY_TYPE", "USER_TEXT"]).default("TOOL_DAILY_STATE"),
  capturedAt: z.string().datetime(),
}).strict();

export const ConversationStateDto = z.object({
  pending_meal_candidate: MealCandidateSchema.nullable().default(null),
  pending_meal_update: MealUpdateSchema.nullable().default(null),
  pending_workout_candidate: WorkoutCandidateSchema.nullable().default(null),
  pending_workout_update: WorkoutUpdateSchema.nullable().default(null),
  awaiting_day_type: z.boolean().default(false),
  awaiting_missing_fields: AwaitingMissingFieldsSchema.nullable().default(null),
  last_menu_check: LastMenuCheckSchema.nullable().default(null),
  last_calorie_estimate: LastCalorieEstimateSchema.nullable().default(null),
  last_workout_context: LastWorkoutContextSchema.nullable().default(null),
  resolved_day_type: ResolvedDayTypeSchema.nullable().default(null),
  updatedAt: z.string().datetime(),
});

export const ConversationStatePatchDto = z.object({
  pending_meal_candidate: MealCandidateSchema.nullable().optional(),
  pending_meal_update: MealUpdateSchema.nullable().optional(),
  pending_workout_candidate: WorkoutCandidateSchema.nullable().optional(),
  pending_workout_update: WorkoutUpdateSchema.nullable().optional(),
  awaiting_day_type: z.boolean().optional(),
  awaiting_missing_fields: AwaitingMissingFieldsSchema.nullable().optional(),
  last_menu_check: LastMenuCheckSchema.nullable().optional(),
  last_calorie_estimate: LastCalorieEstimateSchema.nullable().optional(),
  last_workout_context: LastWorkoutContextSchema.nullable().optional(),
  resolved_day_type: ResolvedDayTypeSchema.nullable().optional(),
  clearKeys: z.array(z.enum([
    "pending_meal_candidate",
    "pending_meal_update",
    "pending_workout_candidate",
    "pending_workout_update",
    "awaiting_missing_fields",
    "last_menu_check",
    "last_calorie_estimate",
    "last_workout_context",
    "resolved_day_type",
  ])).optional(),
}).strict();

export const PendingActionToolInputDto = z.object({
  pending_meal_candidate: MealCandidateSchema.nullable().optional(),
  pending_meal_update: MealUpdateSchema.nullable().optional(),
  pending_workout_candidate: WorkoutCandidateSchema.nullable().optional(),
  pending_workout_update: WorkoutUpdateSchema.nullable().optional(),
  awaiting_day_type: z.boolean().optional(),
  awaiting_missing_fields: AwaitingMissingFieldsSchema.nullable().optional(),
  last_menu_check: LastMenuCheckSchema.nullable().optional(),
  last_calorie_estimate: LastCalorieEstimateSchema.nullable().optional(),
  last_workout_context: LastWorkoutContextSchema.nullable().optional(),
  resolved_day_type: ResolvedDayTypeSchema.nullable().optional(),
  clearKeys: z.array(z.enum([
    "pending_meal_candidate",
    "pending_meal_update",
    "pending_workout_candidate",
    "pending_workout_update",
    "awaiting_missing_fields",
    "last_menu_check",
    "last_calorie_estimate",
    "last_workout_context",
    "resolved_day_type",
  ])).optional(),
}).strict();
