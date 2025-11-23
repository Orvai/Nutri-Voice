// This file converts your Zod DTOs into JSON Schema definitions using
// Zod's built-in `toJSONSchema` method (available in Zod v4).  No
// external dependencies are required.  Each exported constant can be
// merged into the `components.schemas` section of your Swagger config.
const { z } = require('zod');
const {
        createCredentialDto,
        updateCredentialDto,
        credentialResponseDto
} = require('../dto/credential.dto');
const {
        registerMFADeviceDto,
        verifyMFADto,
        mfaDeviceDto, sessionDto,
        revokeTokenInput
} = require('../dto/mfa.dto');
const {
        createUserDto,
        updateUserDto,
        userResponseDto
} = require('../dto/user.dto');
const {
        createSubscriptionDto,
        updateSubscriptionDto,
        subscriptionResponseDto
} = require('../dto/subscription.dto');
const { upsertUserInfoDto,
        UserInfoResponseDto
} = require('../dto/userInfo.dto');
const {
    registerRequestDto,
    registerSuccessResponseDto,
    loginRequestDto,
    logoutRequestDto
} = require('../dto/auth.dto');


function toJsonSchema(dto, name) {
    const schema = z.toJSONSchema(dto, {
        // allow unrepresentable types instead of throwing
        unrepresentable: "any",
        // custom conversion for dates
        override: (ctx) => {
            const def = ctx.zodSchema._zod.def;
            if (def && def.type === 'date') {
                ctx.jsonSchema.type = 'string';
                ctx.jsonSchema.format = 'date-time';
            }
        },
    });
    // attach a title so the schema appears with a friendly name
    return { title: name, ...schema };
}
// Convert each DTO into a JSON Schema and assign a descriptive name
const CreateCredentialInput   = toJsonSchema(createCredentialDto,   'CreateCredentialInput');
const UpdateCredentialInput   = toJsonSchema(updateCredentialDto,   'UpdateCredentialInput');

const RegisterMFAInput        = toJsonSchema(registerMFADeviceDto, 'RegisterMFAInput');
const VerifyMFAInput          = toJsonSchema(verifyMFADto,          'VerifyMFAInput');
const RevokeTokenInput          = toJsonSchema(revokeTokenInput,          'revokeTokenInput');

const CreateUserInput         = toJsonSchema(createUserDto,         'CreateUserInput');
const UpdateUserInput         = toJsonSchema(updateUserDto,         'UpdateUserInput');

const CreateSubscriptionInput = toJsonSchema(createSubscriptionDto, 'CreateSubscriptionInput');
const UpdateSubscriptionInput = toJsonSchema(updateSubscriptionDto, 'UpdateSubscriptionInput');

const UserInfoInput           = toJsonSchema(upsertUserInfoDto,     'UserInfoInput');


const RegisterRequestDto           = toJsonSchema(registerRequestDto,     'registerRequestDto');
const LoginRequestDto           = toJsonSchema(loginRequestDto,     'loginRequestDto');
const LogoutRequestDto           = toJsonSchema(logoutRequestDto,     'LogoutRequestDto');





// ---- response DTOs ----
const User          = toJsonSchema(userResponseDto,          'User');
const Credential    = toJsonSchema(credentialResponseDto,    'Credential');
const Subscription  = toJsonSchema(subscriptionResponseDto,  'Subscription');
const MFADevice     = toJsonSchema(mfaDeviceDto,             'MFADevice');
const Session       = toJsonSchema(sessionDto,               'Session');
const UserInfo       = toJsonSchema(UserInfoResponseDto,               'UserInfo');
const RegisterSuccessResponseDto       = toJsonSchema(registerSuccessResponseDto,               'registerResponseDto');


// Export all schemas under the names referenced by your controllers
module.exports = {
    // request
    CreateCredentialInput,
    UpdateCredentialInput,
    RegisterMFAInput,
    VerifyMFAInput,
    CreateUserInput,
    UpdateUserInput,
    CreateSubscriptionInput,
    UpdateSubscriptionInput,
    UserInfoInput,
    RevokeTokenInput,
    RegisterRequestDto,
    LoginRequestDto,
    LogoutRequestDto,

    // response
    User,
    Credential,
    Subscription,
    MFADevice,
    Session,
    UserInfo,
    RegisterSuccessResponseDto
};