const { z } = require('zod');


const subscriptionResponseDto = z.object({
    id: z.string().uuid(),
    userId: z.string().uuid(),
    orgId: z.string().uuid().nullable(),
    userType: z.enum(['internal', 'customer']),
    type: z.enum(['free', 'pro']),
    status: z.enum(['active', 'deleted', 'locked']),
    startDate: z.string().datetime(),
    endDate: z.string().datetime().nullable(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
});


const createSubscriptionDto = z.object({
    userId: z.string().uuid(),
    type: z.enum(['free','pro']),
    userType: z.enum(['internal','customer']),
    startDate: z.coerce.date().optional(),
    endDate: z.union([z.coerce.date(), z.null()]).optional()
}).superRefine((data, ctx) => {
    const start = data.startDate;
    const end = data.endDate ?? undefined;
    if (start && end && end < start) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['endDate'],
            message: 'endDate must be after startDate'
        });
    }
});

const updateSubscriptionDto = z.object({
    type: z.enum(['free','pro']).optional(),
    startDate: z.coerce.date().optional(),
    endDate: z.union([z.coerce.date(), z.null()]).optional(),
    userType: z.enum(['internal','customer']).optional(),
    status: z.enum(['active','deleted','locked']).optional()
}).superRefine((data, ctx) => {
    if (!Object.values(data).some((value) => value !== undefined)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'At least one field must be provided to update a subscription',
            path: [],
        });
    }
    if (data.startDate && data.endDate && data.endDate < data.startDate) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['endDate'],
            message: 'endDate must be after startDate'
        });
    }
});

module.exports = { createSubscriptionDto, updateSubscriptionDto,subscriptionResponseDto };
