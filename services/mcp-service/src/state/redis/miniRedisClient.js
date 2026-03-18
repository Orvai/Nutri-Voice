import net from "node:net";
import { env } from "../../config/env.js";

const NEED_MORE = Symbol("NEED_MORE");

function encodeCommand(args) {
  const parts = [`*${args.length}\r\n`];
  for (const arg of args) {
    const value = String(arg);
    parts.push(`$${Buffer.byteLength(value)}\r\n${value}\r\n`);
  }
  return parts.join("");
}

function parseResp(buffer, offset = 0) {
  if (buffer.length <= offset) return NEED_MORE;

  const prefix = buffer[offset];
  const lineEnd = buffer.indexOf("\r\n", offset + 1);
  if (lineEnd === -1) return NEED_MORE;

  const line = buffer.toString("utf8", offset + 1, lineEnd);
  const nextOffset = lineEnd + 2;

  if (prefix === 43) {
    return { value: line, nextOffset };
  }

  if (prefix === 58) {
    return { value: Number.parseInt(line, 10), nextOffset };
  }

  if (prefix === 45) {
    const err = new Error(line);
    err.code = "REDIS_ERROR";
    return { error: err, nextOffset };
  }

  if (prefix === 36) {
    const length = Number.parseInt(line, 10);
    if (length === -1) {
      return { value: null, nextOffset };
    }

    const bulkEnd = nextOffset + length;
    if (buffer.length < bulkEnd + 2) return NEED_MORE;
    const value = buffer.toString("utf8", nextOffset, bulkEnd);
    return { value, nextOffset: bulkEnd + 2 };
  }

  const err = new Error(`Unsupported Redis RESP prefix: ${String.fromCharCode(prefix)}`);
  err.code = "REDIS_RESP_UNSUPPORTED";
  throw err;
}

function parseRedisUrl() {
  const redisUrl = new URL(env.REDIS_URL);
  const username = redisUrl.username ? decodeURIComponent(redisUrl.username) : null;
  const password = redisUrl.password ? decodeURIComponent(redisUrl.password) : null;
  const dbRaw = redisUrl.pathname ? redisUrl.pathname.replace(/^\//, "") : "";
  const db = dbRaw ? Number.parseInt(dbRaw, 10) : 0;

  return {
    host: redisUrl.hostname || "127.0.0.1",
    port: redisUrl.port ? Number.parseInt(redisUrl.port, 10) : 6379,
    username,
    password,
    db: Number.isFinite(db) ? db : 0,
  };
}

async function openSocket() {
  const { host, port } = parseRedisUrl();
  const socket = net.createConnection({ host, port });
  socket.setTimeout(env.REDIS_TIMEOUT_MS);

  await new Promise((resolve, reject) => {
    socket.once("connect", resolve);
    socket.once("error", reject);
    socket.once("timeout", () => {
      reject(new Error("Redis socket timeout"));
    });
  });

  return socket;
}

async function runCommands(commands) {
  const socket = await openSocket();

  let buffer = Buffer.alloc(0);
  let waiting = null;
  let closed = false;

  const cleanup = () => {
    socket.removeAllListeners();
  };

  const failWaiting = (error) => {
    if (waiting) {
      const current = waiting;
      waiting = null;
      current.reject(error);
    }
  };

  const tryResolve = () => {
    if (!waiting) return;
    const parsed = parseResp(buffer);
    if (parsed === NEED_MORE) return;

    buffer = buffer.subarray(parsed.nextOffset);
    const current = waiting;
    waiting = null;

    if (parsed.error) {
      current.reject(parsed.error);
      return;
    }
    current.resolve(parsed.value);
  };

  socket.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
    tryResolve();
  });

  socket.on("error", (error) => {
    failWaiting(error);
  });

  socket.on("timeout", () => {
    failWaiting(new Error("Redis command timeout"));
  });

  socket.on("close", () => {
    closed = true;
    failWaiting(new Error("Redis connection closed"));
  });

  async function send(command) {
    if (closed) {
      throw new Error("Redis connection is closed");
    }

    socket.write(encodeCommand(command));

    return new Promise((resolve, reject) => {
      waiting = { resolve, reject };
      tryResolve();
    });
  }

  try {
    let result = null;
    for (const command of commands) {
      result = await send(command);
    }
    socket.end();
    cleanup();
    return result;
  } catch (error) {
    socket.destroy();
    cleanup();
    throw error;
  }
}

export class MiniRedisClient {
  constructor() {
    this.config = parseRedisUrl();
  }

  async command(args) {
    const commands = [];

    if (this.config.password) {
      if (this.config.username) {
        commands.push(["AUTH", this.config.username, this.config.password]);
      } else {
        commands.push(["AUTH", this.config.password]);
      }
    }

    if (this.config.db > 0) {
      commands.push(["SELECT", String(this.config.db)]);
    }

    commands.push(args);

    return runCommands(commands);
  }

  async get(key) {
    return this.command(["GET", key]);
  }

  async setEx(key, ttlSeconds, value) {
    return this.command(["SET", key, value, "EX", String(ttlSeconds)]);
  }

  async del(key) {
    return this.command(["DEL", key]);
  }
}
