const { z } = require("zod");
//
// CREATE VitaminMaster
//
const VitaminCreateDto = z
  .object({
    name: z.string().min(1),
    description: z.string().nullable().optional(),
  })
  .strict();

//
// UPDATE VitaminMaster
//
const VitaminUpdateDto = z
  .object({
    name: z.string().optional(),
    description: z.string().nullable().optional(),
  })
  .strict();

//
// RESPONSE VitaminMaster
//
const VitaminResponseDto = z
  .object({
    id: z.string(),
    name: z.string(),
    description: z.string().nullable(),
  })
  .strict();



const TemplateMenuVitaminDto = z
  .object({
    id: z.string(),
    vitaminId: z.string().nullable(),
    name: z.string(),
    description: z.string().nullable(),
    vitamin: z
      .object({
        id: z.string(),
        name: z.string(),
        description: z.string().nullable(),
      })
      .nullable()
      .optional(),
  })
  .strict();



const ClientMenuVitaminDto = z
  .object({
    id: z.string(),
    vitaminId: z.string().nullable(),
    name: z.string(),
    description: z.string().nullable(),
    vitamin: z
      .object({
        id: z.string(),
        name: z.string(),
        description: z.string().nullable(),
      })
      .nullable()
      .optional(),
  })
  .strict();

module.exports = {
  VitaminCreateDto,
  VitaminUpdateDto,
  VitaminResponseDto,
  TemplateMenuVitaminDto,
  ClientMenuVitaminDto,
};
