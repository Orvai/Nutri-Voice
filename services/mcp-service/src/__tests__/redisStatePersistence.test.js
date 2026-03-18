import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

describe("redis state persistence scaffolding", () => {
  beforeEach(() => {
    vi.resetModules();
    process.env.GATEWAY_BASE_URL = "http://localhost:4010";
    process.env.INTERNAL_TOKEN = "test-internal-token";
    process.env.CONVERSATION_STATE_BACKEND = "redis";
    process.env.REDIS_URL = "redis://localhost:6379";
  });

  afterEach(() => {
    process.env.CONVERSATION_STATE_BACKEND = "memory";
  });

  it("persists coach session state via redis backend client", async () => {
    const kv = new Map();

    vi.doMock("../state/redis/miniRedisClient.js", () => {
      class FakeRedisClient {
        async get(key) {
          return kv.get(key) || null;
        }

        async setEx(key, _ttlSeconds, value) {
          kv.set(key, value);
          return "OK";
        }

        async del(key) {
          kv.delete(key);
          return 1;
        }
      }

      return {
        MiniRedisClient: FakeRedisClient,
      };
    });

    const { patchCoachSessionState, getCoachSessionState } = await import(
      "../coach/state/coachSession.store.js"
    );

    await patchCoachSessionState("coach-conv-redis-1", {
      activeClient: {
        id: "client-1",
        name: "Daniel",
      },
    });

    const saved = await getCoachSessionState("coach-conv-redis-1");

    expect(saved.activeClient?.id).toBe("client-1");
    expect(kv.size).toBeGreaterThan(0);
  });
});
