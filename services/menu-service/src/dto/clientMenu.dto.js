// src/dto/clientMenu.dto.js
const { z } = require("zod");
const { DayTypeEnum } = require("./dailyMenu.dto");

const ClientMenuCreateRequestDto = z.object({
  name: z.string().min(2),
  clientId: z.string(),
  dailyMenuTemplateId: z.string().optional(),
  structureJson: z.any().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

const ClientMenuUpdateRequestDto = z.object({
  name: z.string().optional(),
  structureJson: z.any().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  isActive: z.boolean().optional(),
  notes: z.string().optional(),
});

const ClientMenuResponseDto = z.object({
  id: z.string(),
  name: z.string(),
  clientId: z.string(),
  coachId: z.string(),
  dailyMenuTemplateId: z.string().nullable(),
  structureJson: z.any().nullable(),
  startDate: z.date().nullable(),
  endDate: z.date().nullable(),
  notes: z.string().nullable(),
  isActive: z.boolean(),
  createdAt: z.date(),
  updatedAt: z.date(),
  dailyTemplate: z
    .object({
      id: z.string(),
      name: z.string(),
      dayType: DayTypeEnum,
    })
    .nullable(),
});

module.exports = {
  ClientMenuCreateRequestDto,
  ClientMenuUpdateRequestDto,
  ClientMenuResponseDto,
};
