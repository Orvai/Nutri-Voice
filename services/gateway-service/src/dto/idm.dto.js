const { z } = require("zod");

/* ============================================
   AUTH DTOs (PUBLIC)
============================================ */

// ---------- Login ----------
const LoginRequestDto = z.object({
  email: z.string().email(),
  password: z.string(),
});

const LoginResponseDto = z.object({
  user: z.object({
    id: z.string(),
    email: z.string().email(),
    firstName: z.string().nullable(),
    phone: z.string().nullable().optional(),
    lastName: z.string().nullable(),
    status: z.enum(["active", "locked"]),
    role: z.string(),
  }),

  sessionId: z.string(),

  tokens: z.object({
    accessToken: z.string(),
    refreshToken: z.string(),
    accessTokenExp: z.number().optional(),
    refreshTokenExp: z.number().optional(),
  }),
});

// ---------- Register ----------
const RegisterRequestDto = z.object({
  email: z.string().email(),
  phone: z.string().min(4),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  password: z.string().min(8),
  role: z.enum(["trainer", "client", "admin"]).optional(),
});

const RegisterResponseDto = z.object({
  data: z.object({
    message: z.string(),
    id: z.string().or(z.number()),
  }),
});

// ---------- Refresh Token ----------
const RefreshTokenResponseDto = z.object({
  data: z.object({
    accessToken: z.string(),
    expiresAt: z.string(),
    tokenType: z.string(),
  }),
});

// ---------- Logout ----------
const LogoutRequestDto = z.object({});
const LogoutResponseDto = z.object({
  data: z.object({
    success: z.boolean(),
  }),
});


/* ============================================
   MFA DTOs
============================================ */

const MfaRegisterRequestDto = z.object({});
const MfaRegisterResponseDto = z.object({
  data: z.object({
    id: z.string(),
    type: z.string(),
    userId: z.string(),
  }),
});

const MfaVerifyRequestDto = z.object({
  code: z.string().min(6),
});

const MfaVerifyResponseDto = z.object({
  data: z.object({
    accessToken: z.string(),
    expiresAt: z.string(),
    tokenType: z.string(),
  }),
});


/* ============================================
   CLIENT LIST (AGGREGATED)
============================================ */

const ClientListItemDto = z.object({
  id: z.string(),
  name: z.string(),
  phone: z.string().nullable(),
  email: z.string().nullable(),
  profileImageUrl: z.string().url().nullable(),
  gender: z.string().nullable(),
  age: z.number().nullable(),
  height: z.number().nullable(),
  weight: z.number().nullable(),
  goals: z.any().nullable(),
  activityLevel: z.any().nullable(),
  creationDate: z.string().nullable(),
  city: z.string().nullable(),
  address: z.string().nullable(),
});

const ClientsListResponseDto = z.object({
  data: z.array(ClientListItemDto),
});


/* ============================================
   RAW USER INFO (forwarded)
============================================ */

const UserInfoResponseDto = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  status: z.enum(['active', 'deleted', 'archived']).default('active'),

  dateOfBirth: z.string().datetime().nullish(),
  gender: z.string().nullish(),
  address: z.string().nullish(),
  city: z.string().nullish(),
  profileImageUrl: z.string().url().nullish(),
  height: z.number().int().nullish(),
  age: z.number().int().nullish(),

  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});



const UpsertUserInfoRequestDto = z.object({
  dateOfBirth: z.string().optional(),
  gender: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  profileImageUrl: z.string().url().optional(),
  height: z.number().optional(),
  age: z.number().optional(),
});

const UpsertUserInfoResponseDto = UserInfoResponseDto;


/* ============================================
   EXPORTS (CommonJS)
============================================ */

module.exports = {
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  RegisterResponseDto,
  RefreshTokenResponseDto,
  LogoutRequestDto,
  LogoutResponseDto,
  MfaRegisterRequestDto,
  MfaRegisterResponseDto,
  MfaVerifyRequestDto,
  MfaVerifyResponseDto,
  ClientListItemDto,
  ClientsListResponseDto,
  UserInfoResponseDto,
  UpsertUserInfoRequestDto,
  UpsertUserInfoResponseDto,
};
