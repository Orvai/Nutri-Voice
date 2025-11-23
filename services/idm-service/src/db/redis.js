// src/lib/redis.js
const Redis = require("ioredis");
const url = process.env.REDIS_URL;
if (!url) throw new Error("REDIS_URL is required");

function makeOptsFromUrl(u) {
    const isTLS = u.startsWith("rediss://");
    const opts = {
        lazyConnect: true,
        maxRetriesPerRequest: 2,
        enableAutoPipelining: true,
    };
    if (isTLS) {
        // SNI can be required on some Redis Cloud endpoints
        const { hostname } = new URL(u);
        opts.tls = { servername: hostname };
    }
    return opts;
}

const redis = new Redis(url, makeOptsFromUrl(url));

redis.on("error", (err) => {
    console.error("[redis] error:", err.message);
});

async function ensureRedisConnected() {
    if (redis.status === "end" || redis.status === "wait") {
        await redis.connect();
    }
}

process.on("SIGTERM", () => redis.quit());
process.on("SIGINT", () => redis.quit());

module.exports = { redis, ensureRedisConnected };
