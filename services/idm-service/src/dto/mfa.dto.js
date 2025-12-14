const { z } = require('zod');

const mfaDeviceDto = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.literal('totp'),
  label: z.string().optional(),
  lastUsedAt: z.string().datetime().nullish(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// RESPONSE: session after login
const sessionDto = z.object({
  accessToken: z.string(),
  expiresAt: z.string().datetime(),
  tokenType: z.string().default('Bearer'),
});

const registerMFARequestDto = z.object({
  type: z.literal('totp'),
}).strict();

const verifyMFARequestDto = z.object({
  code: z.string().trim().min(6),
  deviceId: z.string().uuid().optional()
}).strict();

// --- New: Token Management DTOs ---
const revokeTokenInput = z.object({
  token: z.string().min(1),
}).strict();



module.exports = { registerMFARequestDto, verifyMFARequestDto, revokeTokenInput, mfaDeviceDto, sessionDto };