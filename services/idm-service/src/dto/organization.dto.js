const { z } = require('zod');


const organizationResponseDto = z.object({
  id: z.string().uuid(),
  name: z.string(),
  status: z.string(), // use enum if you have it
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  domain: z.string().nullable().optional(),
  address: z.string().nullable().optional(),
  country: z.string().nullable().optional(),
  industry: z.string().nullable().optional(),
  contactEmail: z.string().email().nullable().optional(),
  contactPhone: z.string().nullable().optional(),
  size: z.number().int().nullable().optional()
});

const createOrgDto = z.object({
  name: z.string().trim().min(2),
  domain: z.string().trim().min(2).nullish(),
  address: z.string().trim().nullish(),
  country: z.string().trim().nullish(),
  industry: z.string().trim().nullish(),
  contactEmail: z.string().trim().email().nullish(),
  contactPhone: z.string().trim().nullish(),
  size: z.number().int().min(0).nullish()
});

const updateOrgDto = createOrgDto.partial().superRefine((data, ctx) => {
  if (!Object.values(data).some((value) => value !== undefined)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least one field must be provided to update an organization',
      path: [],
    });
  }
});
module.exports = { createOrgDto, updateOrgDto, organizationResponseDto };