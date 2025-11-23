// src/dto/dailyMenu.dto.js
const { z } = require("zod");

const DayTypeEnum = z.enum(["TRAINING", "REST"]);
const MealSlotEnum = z.enum(["MEAL1", "MEAL2", "MEAL3", "CARB_LOAD"]);

const DailyMenuMealInputDto = z.object({
  slot: MealSlotEnum,
  maxCalories: z.number().optional(),
  mealTemplateId: z.string().optional(),
  notes: z.string().optional(),
});

const DailyMenuTemplateCreateRequestDto = z.object({
  name: z.string().min(2),
  dayType: DayTypeEnum,
  meals: z.array(DailyMenuMealInputDto).min(1),
});

const DailyMenuTemplateUpdateRequestDto = z.object({
  name: z.string().optional(),
  dayType: DayTypeEnum.optional(),
  meals: z.array(DailyMenuMealInputDto).optional(),
});

const DailyMenuTemplateResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  dayType: DayTypeEnum,
  coachId: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  meals: z.array(
    z.object({
      id: z.string(),
      slot: MealSlotEnum,
      maxCalories: z.number().nullable(),
      mealTemplateId: z.string().nullable(),
      notes: z.string().nullable(),
      createdAt: z.date(),
    })
  ),
});

module.exports = {
  DayTypeEnum,
  MealSlotEnum,
  DailyMenuMealInputDto,
  DailyMenuTemplateCreateRequestDto,
  DailyMenuTemplateUpdateRequestDto,
  DailyMenuTemplateResponseDto,
};
