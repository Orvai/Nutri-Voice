const { z } = require('zod');


const credentialResponseDto = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.enum(['password','oauth','sso']).default('password'),
  externalId: z.string().nullish(),
  status: z.enum(['active','deleted','locked']),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});


const createCredentialDto = z.object({
  userId: z.string().uuid(),
  type: z.enum(['password','oauth','sso']),
  password: z.string().trim().min(8).optional(),
  externalId: z.string().trim().optional()
}).superRefine((data, ctx) => {
  if (data.type === 'password' && !data.password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['password'],
      message: 'Password credentials require a password value.',
    });
  }

  if (data.type !== 'password' && data.password) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['password'],
      message: 'Only password credentials can include a password value.',
    });
  }
});

const updateCredentialDto = z.object({
  password: z.string().trim().min(8).optional(),
  externalId: z.string().trim().optional(),
  status: z.enum(['active','deleted','locked']).optional()
}).superRefine((data, ctx) => {
  if (!Object.values(data).some((value) => value !== undefined)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'At least one field must be provided to update a credential.',
      path: [],
    });
  }
});

module.exports = { createCredentialDto, updateCredentialDto, credentialResponseDto };
