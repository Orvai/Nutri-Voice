const { z } = require('zod');


// RESPONSE: full user returned by the API
const userResponseDto = z.object({
    id: z.string(), // use .uuid() if you enforce UUIDs
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    phone: z.string().optional(),
    // if you have userStatusEnum, prefer: status: userStatusEnum
    status: z.string(),
    organizationId: z.string().optional(),
    createdAt: z.string().datetime(), // Zod v4-friendly for JSON Schema
    updatedAt: z.string().datetime(),
});


const userStatusEnum = z.enum(['active', 'deleted', 'locked']);

const createUserDto = z.object({
    email: z.string().trim().email(),
    phone: z.string().trim().min(4),
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1)
});

const updateUserDto = z.object({
    email: z.string().trim().email().optional(),
    phone: z.string().trim().optional(),
    firstName: z.string().trim().optional(),
    lastName: z.string().trim().optional(),
}).superRefine((data, ctx) => {
    if (!Object.values(data).some((value) => value !== undefined)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'No valid fields provided for update',
            path: [],
        });
    }
});

module.exports = { userStatusEnum, createUserDto, updateUserDto,userResponseDto };
