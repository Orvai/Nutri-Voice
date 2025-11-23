const { z } = require('zod');

const EMAIL_USERNAME_REGEX = /^[A-Za-z][A-Za-z0-9._+-]{2,29}$/;
const PASSWORD_RULES = [
    {regex: /[a-z]/, description: 'one lowercase letter'},
    {regex: /[A-Z]/, description: 'one uppercase letter'},
    {regex: /\d/, description: 'one number'},
    {regex: /[^A-Za-z0-9]/, description: 'one special character'},
];


const registerRequestDto = z
    .object({
        email: z.string().trim().email(),
        phone: z.string().trim().min(4),
        firstName: z.string().trim().min(1),
        lastName: z.string().trim().min(1),
        password: z.string().trim().min(8), // or whatever base length you want
        role: z.enum(['trainer','client','admin']).optional().default('client')    })
    .superRefine((data, ctx) => {
        const [username] = data.email.split("@");
        if (!username || !EMAIL_USERNAME_REGEX.test(username)) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["email"],
                message:
                    "Email username must start with a letter and contain only letters, numbers, dots, underscores, plus, or hyphen characters.",
            });
        }

        const missingRules = PASSWORD_RULES.filter(({ regex }) =>
            !regex.test(data.password)
        );
        if (missingRules.length) {
            const readable = missingRules
                .map(({ description }) => description)
                .join(", ");
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["password"],
                message: `Password must include at least ${readable}.`,
            });
        }
    });

const registerSuccessResponseDto = z.object({
    message: z.string(),
    id: z.number(),
});

const loginRequestDto = z.object({
    email: z.string().trim().email(),
    password: z.string().min(8),
});

const loginContextDto = z.object({
    email: z.string().trim().email(),
    password: z.string().min(8),
    ip: z.string().trim().nullable().optional(),
    userAgent: z.string().trim().nullable().optional(),
});

const logoutRequestDto = z.object({
    sessionId: z.string().uuid(),
});



module.exports = {
    registerRequestDto,
    registerSuccessResponseDto,
    loginRequestDto,
    loginContextDto,
    logoutRequestDto
};
