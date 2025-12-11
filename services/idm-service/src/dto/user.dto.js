const { z } = require('zod');

const userStatusEnum = z.enum(['active', 'deleted', 'locked']);
const userRoleEnum = z.enum(['trainer', 'client', 'admin']);

const userResponseDto = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  phone: z.string().optional(),
  status: userStatusEnum,
  role: userRoleEnum,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const createUserDto = z.object({
  email: z.string().trim().email(),
  phone: z.string().trim().min(4),
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  role: userRoleEnum.optional(),
});

const updateUserDto = z
  .object({
    email: z.string().trim().email().optional(),
    phone: z.string().trim().optional(),
    firstName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
    role: userRoleEnum.optional(),
  })
  .superRefine((data, ctx) => {
    if (!Object.values(data).some((value) => value !== undefined)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'No valid fields provided for update',
        path: [],
      });
    }
  });

module.exports = { userStatusEnum, userRoleEnum, createUserDto, updateUserDto, userResponseDto };