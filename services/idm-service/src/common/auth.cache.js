const { redis, ensureRedisConnected } = require("../db/redis");

const PREFIX = process.env.REDIS_KEY_PREFIX || "idm:";

// Key helpers
const k = {
    at: (jti) => `${PREFIX}at:${jti}`,                 // access token allow/metadata
    atRevoked: (jti) => `${PREFIX}revoked:at:${jti}`,  // blacklist for access tokens
    rt: (jti) => `${PREFIX}rt:${jti}`,                 // refresh token record (single-use)
    userRtSet: (userId) => `${PREFIX}user:${userId}:rt`// track user's RT JTIs
};

/**
 * Compute TTL from exp (seconds since epoch).
 */
function ttlFromExp(expSeconds) {
    const nowSec = Math.floor(Date.now() / 1000);
    return Math.max(1, expSeconds - nowSec);
}

/**
 * Store access token metadata so you can (optionally) check presence
 * and/or attach server-side state. Not strictly required for JWTs,
 * but useful if you want server-side invalidation windows.
 */
async function saveAccessToken({ jti, userId, exp, meta = {} }) {
    await ensureRedisConnected();
    const ttl = ttlFromExp(exp);
    const payload = JSON.stringify({ uid: userId, exp, meta });
    await redis.set(k.at(jti), payload, "EX", ttl);
}

/**
 * Revoke an access token by JTI until its natural expiry.
 * Use this on logout/compromise to deny further use even if JWT is valid.
 */
async function revokeAccessToken(jti, exp) {
    await ensureRedisConnected();
    const ttl = ttlFromExp(exp);
    await redis.set(k.atRevoked(jti), "1", "EX", ttl);
    // optional: remove allow entry if you save it
    await redis.del(k.at(jti)).catch(() => {});
}

/**
 * Check if an access token JTI is revoked.
 * Call this after signature/claims validation.
 */
async function isAccessTokenRevoked(jti) {
    await ensureRedisConnected();
    const rvk = await redis.get(k.atRevoked(jti));
    return rvk === "1";
}

/**
 * Save a refresh token record. Designed for single-use rotation:
 * - Keep a copy keyed by JTI with userId and optional meta
 * - Add JTI to a per-user set for future cleanup
 */
async function saveRefreshToken({ jti, userId, exp, meta = {} }) {
    await ensureRedisConnected();
    const ttl = ttlFromExp(exp);
    const data = JSON.stringify({ uid: userId, exp, meta, jti });
    await redis.multi()
        .set(k.rt(jti), data, "EX", ttl)
        .sadd(k.userRtSet(userId), jti)
        .exec();
}

/**
 * Remove a specific refresh token (by session JTI) and optionally detach it
 * from the owning user's set. Use this when a single session is being closed
 * so other active refresh tokens remain valid.
 */
async function revokeRefreshTokenForSession(jti, userId) {
    await ensureRedisConnected();
    const multi = redis.multi().del(k.rt(jti));
    if (userId) multi.srem(k.userRtSet(userId), jti);
    await multi.exec();
}


/**
 * Consume a refresh token JTI exactly once.
 * Returns record or null if missing/expired/already used.
 */
async function consumeRefreshToken(jti) {
    await ensureRedisConnected();
    const key = k.rt(jti);
    const data = await redis.get(key);
    if (!data) return null; // already used or expired

    // delete first to enforce single-use even under race conditions
    await redis.del(key);
    try {
        return JSON.parse(data);
    } catch {
        return null;
    }
}

/**
 * Revoke all refresh tokens for a user (e.g., password change).
 * This does NOT require KEYS scan; it uses the per-user set we maintain.
 */
async function revokeAllRefreshTokensForUser(userId) {
    await ensureRedisConnected();
    const setKey = k.userRtSet(userId);
    const jtIs = await redis.smembers(setKey);
    if (jtIs.length) {
        const delKeys = jtIs.map((jti) => k.rt(jti));
        await redis.del(...delKeys).catch(() => {});
    }
    await redis.del(setKey).catch(() => {});
}

module.exports = {
    saveAccessToken,
    revokeAccessToken,
    isAccessTokenRevoked,
    saveRefreshToken,
    consumeRefreshToken,
    revokeAllRefreshTokensForUser,
    revokeRefreshTokenForSession
};
