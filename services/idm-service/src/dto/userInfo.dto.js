const { z } = require('zod');


const UserInfoResponseDto = z.object({
  // --- Core Response Fields ---
  id: z.string().uuid(), // Assumes a UUID for the UserInfo record
  userId: z.string().uuid(), // Link back to the main User record
  status: z.enum(['active', 'deleted', 'archived']).default('active'), // Optional: A status for the info record itself

  // --- User Info Fields (from previous context) ---
  dateOfBirth: z.string().datetime().nullish(), // Changed to datetime/date string and nullish for flexibility
  gender: z.string().nullish(),
  address: z.string().nullish(),
  city: z.string().nullish(),
  profileImageUrl: z.string().url().nullish(),
  height: z.number().int().nullish(),
  age: z.number().int().nullish(),

  // --- Metadata Fields ---
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

const upsertUserInfoDto = z.object({
  dateOfBirth: z.string().trim().optional(),
  gender: z.string().trim().optional(),
  address: z.string().trim().optional(),
  city: z.string().trim().optional(),
  profileImageUrl: z.string().trim().url().optional(),
  height: z.coerce.number().int().positive().optional(),
  age: z.coerce.number().int().positive().optional(),
  
});

module.exports = { upsertUserInfoDto, UserInfoResponseDto };
