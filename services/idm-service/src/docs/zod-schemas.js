const { z } = require('zod');

const { createCredentialDto, updateCredentialDto, credentialResponseDto } = require('../dto/credential.dto');
const { registerMFADeviceDto, verifyMFADto, revokeTokenInput, mfaDeviceDto, sessionDto } = require('../dto/mfa.dto');
const { createUserDto, updateUserDto, userResponseDto, userRoleEnum, userStatusEnum } = require('../dto/user.dto');
const { createSubscriptionDto, updateSubscriptionDto, subscriptionResponseDto } = require('../dto/subscription.dto');
const { upsertUserInfoDto, UserInfoResponseDto } = require('../dto/userInfo.dto');
const { createOrgDto, updateOrgDto, organizationResponseDto } = require('../dto/organization.dto');
const { registerRequestDto, registerSuccessResponseDto, loginRequestDto, loginContextDto, logoutRequestDto } = require('../dto/auth.dto');

function toJsonSchema(name, schema) {
  const json = z.toJSONSchema(schema, {
    unrepresentable: 'any',
    override: (ctx) => {
      const def = ctx.zodSchema?._zod?.def;
      if (def && def.type === 'date') {
        ctx.jsonSchema.type = 'string';
        ctx.jsonSchema.format = 'date-time';
      }
    },
  });
  return { title: name, ...json };
}

const schemas = {
  // Request DTOs
  IDM_CreateCredentialRequestDto: createCredentialDto,
  IDM_UpdateCredentialRequestDto: updateCredentialDto,
  IDM_RegisterMFADeviceRequestDto: registerMFADeviceDto,
  IDM_VerifyMFARequestDto: verifyMFADto,
  IDM_RevokeTokenRequestDto: revokeTokenInput,
  IDM_CreateUserRequestDto: createUserDto,
  IDM_UpdateUserRequestDto: updateUserDto,
  IDM_CreateSubscriptionRequestDto: createSubscriptionDto,
  IDM_UpdateSubscriptionRequestDto: updateSubscriptionDto,
  IDM_UpsertUserInfoRequestDto: upsertUserInfoDto,
  IDM_CreateOrganizationRequestDto: createOrgDto,
  IDM_UpdateOrganizationRequestDto: updateOrgDto,
  IDM_RegisterRequestDto: registerRequestDto,
  IDM_LoginRequestDto: loginRequestDto,
  IDM_LoginContextDto: loginContextDto,
  IDM_LogoutRequestDto: logoutRequestDto,

  // Response DTOs
  IDM_CredentialResponseDto: credentialResponseDto,
  IDM_MFADeviceResponseDto: mfaDeviceDto,
  IDM_SessionResponseDto: sessionDto,
  IDM_UserResponseDto: userResponseDto,
  IDM_UserStatusEnum: userStatusEnum,
  IDM_UserRoleEnum: userRoleEnum,
  IDM_SubscriptionResponseDto: subscriptionResponseDto,
  IDM_UserInfoResponseDto: UserInfoResponseDto,
  IDM_OrganizationResponseDto: organizationResponseDto,
  IDM_RegisterSuccessResponseDto: registerSuccessResponseDto,
};

module.exports = Object.entries(schemas).reduce((acc, [name, schema]) => {
  acc[name] = toJsonSchema(name, schema);
  return acc;
}, {});