process.env.GATEWAY_BASE_URL = process.env.GATEWAY_BASE_URL || "http://localhost:4010";
process.env.INTERNAL_TOKEN = process.env.INTERNAL_TOKEN || "test-internal-token";
process.env.CONVERSATION_STATE_BACKEND =
  process.env.CONVERSATION_STATE_BACKEND || "memory";
process.env.REDIS_URL = process.env.REDIS_URL || "redis://localhost:6379";
