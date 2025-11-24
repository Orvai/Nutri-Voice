// src/dto/clientMenu.dto.js
const { z } = require("zod");

const DayTypeEnum = z.enum(["TRAINING", "REST"]);

// ----- Items -----
const ClientMenuMealItemCreateDto = z.object({
  foodItemId: z.string(),
  quantity: z.number().positive(), // בגרמים
  notes: z.string().optional(),
});

const ClientMenuMealItemUpdateDto = z.object({
  id: z.string(),
  foodItemId: z.string().optional(),
  quantity: z.number().positive().optional(),
  notes: z.string().optional(),
});

const ClientMenuMealItemDeleteDto = z.object({
  id: z.string(),
});

// ----- Meals -----

// הוספת ארוחה חדשה מתבנית
const ClientMenuMealAddFromTemplateDto = z.object({
  templateId: z.string(),
  name: z.string().optional(), // אפשר לאובררייד את השם של התבנית
});

// עדכון ארוחה קיימת
const ClientMenuMealUpdateDto = z.object({
  id: z.string(),
  name: z.string().optional(),
  itemsToAdd: z.array(ClientMenuMealItemCreateDto).optional(),
  itemsToUpdate: z.array(ClientMenuMealItemUpdateDto).optional(),
  itemsToDelete: z.array(ClientMenuMealItemDeleteDto).optional(),
});

const ClientMenuMealDeleteDto = z.object({
  id: z.string(),
});

// ----- Menu Create / Update -----

const ClientMenuCreateRequestDto = z.object({
  name: z.string().min(2),
  clientId: z.string(),
  type: DayTypeEnum,
  notes: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

const ClientMenuUpdateRequestDto = z.object({
  name: z.string().optional(),
  type: DayTypeEnum.optional(),
  notes: z.string().optional(),
  isActive: z.boolean().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),

  mealsToAdd: z.array(ClientMenuMealAddFromTemplateDto).optional(),
  mealsToUpdate: z.array(ClientMenuMealUpdateDto).optional(),
  mealsToDelete: z.array(ClientMenuMealDeleteDto).optional(),
});

// ----- Response DTOs -----

const ClientMenuMealItemResponseDto = z.object({
  id: z.string(),
  clientMenuMealId: z.string(),
  foodItemId: z.string(),
  quantity: z.number(),
  calories: z.number(),
  notes: z.string().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const ClientMenuMealResponseDto = z.object({
  id: z.string(),
  clientMenuId: z.string(),
  originalTemplateId: z.string().nullable(),
  name: z.string(),
  totalCalories: z.number(),
  items: z.array(ClientMenuMealItemResponseDto),
  createdAt: z.date(),
  updatedAt: z.date(),
});

const ClientMenuResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  clientId: z.string(),
  coachId: z.string(),
  type: DayTypeEnum,
  totalCalories: z.number(),
  notes: z.string().nullable(),
  isActive: z.boolean(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  meals: z.array(ClientMenuMealResponseDto),
});

module.exports = {
  DayTypeEnum,
  ClientMenuMealItemCreateDto,
  ClientMenuMealItemUpdateDto,
  ClientMenuMealItemDeleteDto,
  ClientMenuMealAddFromTemplateDto,
  ClientMenuMealUpdateDto,
  ClientMenuMealDeleteDto,
  ClientMenuCreateRequestDto,
  ClientMenuUpdateRequestDto,
  ClientMenuMealItemResponseDto,
  ClientMenuMealResponseDto,
  ClientMenuResponseDto,
};
