const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const {addDays, isAfter} = require('date-fns');
const U = require('./user.service');
const {prisma} = require('../db/prisma');
const {createCredentialDto, updateCredentialDto} = require('../dto/credential.dto');
const {registerMFADeviceDto, verifyMFADto} = require('../dto/mfa.dto');
const {AppError} = require('../common/errors');
const {loginContextDto, logoutRequestDto, registerRequestDto} = require('../dto/auth.dto');

const {saveAccessToken,saveRefreshToken,revokeAccessToken,revokeRefreshTokenForSession} = require("../common/auth.cache");
const {validateToken} = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';
const ACCESS_TTL_MIN = parseInt(process.env.ACCESS_TOKEN_TTL_MIN || '30', 10);
const REFRESH_TTL_DAYS = parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || '14', 10);

const REFRESH_COOKIE_NAME = 'refreshToken';
const REFRESH_COOKIE_MAX_AGE_MS = REFRESH_TTL_DAYS * 24 * 60 * 60 * 1000;
const isProduction = process.env.NODE_ENV === 'production';
const REFRESH_COOKIE_BASE_OPTIONS = {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? 'none' : 'lax',
    path: '/api/auth/token'
};


// ---------------- REGISTER ----------------
async function registerUser(payload) {
    const data = registerRequestDto.parse(payload);

    const user = await U.createUser({
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
    });

    await createCredential(user.id, 'password', {password: data.password});
    return {id: user.id, role: user.role};}

// ---------------- CREDENTIALS ----------------
const createCredential = async (userId, type, data = {}) => {
    const parsed = createCredentialDto.parse({userId, type, ...data});
    let passwordHash;
    if (parsed.type === 'password') {
        passwordHash = await bcrypt.hash(parsed.password, 10);
    }
    return prisma.credential.create({
        data: {
            userId: parsed.userId,
            type: parsed.type,
            passwordHash: passwordHash || null,
            externalId: parsed.externalId || null
        }
    });
};
const getCredentialByUser = (userId, type) =>
    prisma.credential.findMany({
        where: {userId, revokedAt: null, ...(type ? {type} : {})}
    });

const verifyCredential = async (userId, input = {}) => {
    const creds = await getCredentialByUser(userId, 'password');
    const cred = creds[0];
    if (!cred || !cred.passwordHash) return false;
    return bcrypt.compare(input.password || '', cred.passwordHash);
};


// ---------------- MFA ----------------
const registerMFADevice = async (userId, type) => {
    const parsed = registerMFADeviceDto.parse({userId, type});
    const secret = speakeasy.generateSecret({length: 20}).base32;
    const device = await prisma.mFADevice.create({data: {userId: parsed.userId, type: parsed.type, secret}});
    return {device, otpauth: `otpauth://totp/App:${parsed.userId}?secret=${secret}&issuer=App`};
};

const verifyMFA = async (userId, code, deviceId) => {
    const parsed = verifyMFADto.parse({userId, code, deviceId});
    const devices = await prisma.mFADevice.findMany({where: {userId: parsed.userId, status: 'active'}});
    const d = parsed.deviceId ? devices.find(x => x.id === parsed.deviceId) : devices[0];
    if (!d) throw new AppError(404, 'MFA device not found');
    return speakeasy.totp.verify({secret: d.secret, encoding: 'base32', token: parsed.code, window: 1});
};

// ---------------- TOKENS ----------------
const signAccess = (sessionId, userId, role) =>
    jwt.sign({sid: sessionId, sub: userId, role, typ: 'access'}, JWT_SECRET, {expiresIn: `${ACCESS_TTL_MIN}m`});

const signRefresh = (sessionId, userId, role) =>
    ({sid: sessionId, sub: userId, role, typ: 'refresh'}, JWT_SECRET, {expiresIn: `${REFRESH_TTL_DAYS}d`});

// ---------------- SESSION ----------------
const createSession = async (userId, role, ip, userAgent) => {
    const session = await prisma.session.create({
        data: {
            userId,
            ip: ip || null,
            userAgent: userAgent || null,
            expiresAt: addDays(new Date(), REFRESH_TTL_DAYS)
        }
    });

    const accessToken = signAccess(session.id, userId, role);
    const refreshToken = signRefresh(session.id, userId, role);


    await saveAccessToken({token: accessToken, jti: session.id, userId, exp: 300});
    await saveRefreshToken({token: refreshToken, jti: session.id, userId, exp: 300});

    return {session, tokens: {accessToken, refreshToken}};
};

const endSession = (sessionId) =>
    prisma.session.update({where: {id: sessionId}, data: {status: 'deleted', expiresAt: new Date()}});

// ---------------- COOKIES ----------------
const buildRefreshCookieOptions = () => ({
    ...REFRESH_COOKIE_BASE_OPTIONS,
    maxAge: REFRESH_COOKIE_MAX_AGE_MS
});

const setRefreshTokenCookie = (res, token) => {
    if (!token) return;
    res.cookie(REFRESH_COOKIE_NAME, token, buildRefreshCookieOptions());
};

const clearRefreshTokenCookie = (res) => {
    res.clearCookie(REFRESH_COOKIE_NAME, REFRESH_COOKIE_BASE_OPTIONS);
};

const getRefreshTokenFromRequest = (req) => req.cookies?.[REFRESH_COOKIE_NAME] || null;

// ---------------- AUTH CORE ----------------
const refreshToken = async (oldRefreshToken) => {
    if (!oldRefreshToken) throw new AppError(401, 'Refresh token required');

    const payload = validateToken(oldRefreshToken);
    if (payload.typ !== 'refresh') throw new AppError(401, 'Not a refresh token');

    const session = await prisma.session.findUnique({where: {id: payload.sid}});
    if (!session || session.status !== 'active' || isAfter(new Date(), new Date(session.expiresAt)))
        throw new AppError(401, 'Session expired');

    const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { role: true } });
    if (!user) throw new AppError(401, 'User not found');

    const accessToken = signAccess(session.id, session.userId, user.role);
    const newRefreshToken = signRefresh(session.id, session.userId, user.role);

    await saveAccessToken({token: accessToken, jti: session.id, userId: session.userId, exp: 300});
    await saveRefreshToken({token: newRefreshToken, jti: session.id, userId: session.userId, exp: 300});

    return {accessToken, refreshToken: newRefreshToken};
};

const login = async (payload) => {
    const data = loginContextDto.parse(payload);
    const user = await U.getUserByEmail(data.email);
    if (!user) throw new AppError(401, 'Invalid email or password');

    const now = new Date();
    if (user.status === 'locked' && user.lockUntil && user.lockUntil > now) {
        const secs = Math.ceil((user.lockUntil.getTime() - now.getTime()) / 1000);
        throw new AppError(423, `Account locked. Try again in ${secs}s`);
    }

    if (user.status === 'locked' && user.lockUntil && user.lockUntil <= now) {
        await U.unlockAccount(user.id);
        user.status = 'active';
    }

    const ok = await verifyCredential(user.id, {password: data.password});
    if (!ok) {
        await U.recordLogin(user.id, false);
        throw new AppError(401, 'Invalid email or password');
    }

    await U.recordLogin(user.id, true);

    const {session, tokens} = await createSession(user.id, user.role, data.ip, data.userAgent);
    if (!tokens?.accessToken || !tokens?.refreshToken)
        throw new AppError(500, 'Failed to generate authentication tokens');

    return {
        user: {
            id: user.id,
            email: user.email,
            phone: user.phone,
            firstName: user.firstName || null,
            lastName: user.lastName || null,
            status: 'active',
            role: user.role
        },
        sessionId: session.id,
        tokens
    };
};

const logout = async ({sessionId}) => {
    const {sessionId: parsedSessionId} = logoutRequestDto.parse({sessionId});

    const session = await prisma.session.findUnique({where: {id: parsedSessionId}});
    if (!session || session.status !== 'active')
        throw new AppError(404, 'Session not found or already inactive');

    const expSeconds = Math.floor(Date.now() / 1000) + ACCESS_TTL_MIN * 60;
    await revokeAccessToken(parsedSessionId, expSeconds);
    await revokeRefreshTokenForSession(parsedSessionId, session.userId);
    await endSession(parsedSessionId);

    return {success: true};
};

module.exports = {
    registerUser,
    createCredential,
    registerMFADevice,
    verifyMFA,
    createSession,
    refreshToken,
    login,
    logout,
    setRefreshTokenCookie,
    clearRefreshTokenCookie,
    getRefreshTokenFromRequest,
    getCredentialByUser,
    verifyCredential
};