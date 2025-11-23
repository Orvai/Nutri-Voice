const { z } = require('zod');

const mfaDeviceDto = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  type: z.string(),         // e.g., 'totp' | 'webauthn'
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

const registerMFADeviceDto = z.object({
  userId: z.string().uuid(),
  type: z.literal('totp')
});

const verifyMFADto = z.object({
  userId: z.string().uuid(),
  code: z.string().trim().min(6),
  deviceId: z.string().uuid().optional()
});

// --- New: Token Management DTOs ---
const revokeTokenInput = z.object({
  token: z.string().min(1),
});



module.exports = { registerMFADeviceDto, verifyMFADto, revokeTokenInput, mfaDeviceDto, sessionDto };
