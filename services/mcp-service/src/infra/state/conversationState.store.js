import {
  ConversationStateDto,
  ConversationStatePatchDto,
} from "../../dtos/conversationState.dto.js";
import { env } from "../../config/env.js";
import { MiniRedisClient } from "./redis/miniRedisClient.js";

const memoryStore = new Map();
const redisClient = env.CONVERSATION_STATE_BACKEND === "redis" ? new MiniRedisClient() : null;

function nowIso() {
  return new Date().toISOString();
}

function getTtlMs() {
  return env.CONVERSATION_STATE_TTL_MIN * 60 * 1000;
}

function getTtlSeconds() {
  return env.CONVERSATION_STATE_TTL_MIN * 60;
}

function buildStateKey(conversationId) {
  return `${env.CONVERSATION_STATE_KEY_PREFIX}:${conversationId}`;
}

function deterministicSort(value) {
  if (Array.isArray(value)) {
    return value.map((item) => deterministicSort(item));
  }

  if (value && typeof value === "object") {
    const out = {};
    const keys = Object.keys(value).sort();
    for (const key of keys) {
      out[key] = deterministicSort(value[key]);
    }
    return out;
  }

  return value;
}

function serializeState(state) {
  return JSON.stringify(deterministicSort(state));
}

function getDefaultState() {
  return ConversationStateDto.parse({
    pending_meal_candidate: null,
    pending_meal_update: null,
    pending_workout_candidate: null,
    pending_workout_update: null,
    awaiting_day_type: false,
    awaiting_missing_fields: null,
    last_menu_check: null,
    last_calorie_estimate: null,
    last_workout_context: null,
    resolved_day_type: null,
    openai_response: null,
    updatedAt: nowIso(),
  });
}

function pruneMemoryStoreIfNeeded() {
  if (memoryStore.size < env.CONVERSATION_STATE_MAX_ENTRIES) return;

  const entries = [...memoryStore.entries()].sort(
    (a, b) => new Date(a[1].updatedAt).getTime() - new Date(b[1].updatedAt).getTime()
  );

  const toDelete = Math.max(1, entries.length - env.CONVERSATION_STATE_MAX_ENTRIES + 1);
  for (let i = 0; i < toDelete; i += 1) {
    memoryStore.delete(entries[i][0]);
  }
}

function isExpired(savedAt) {
  if (!savedAt) return true;
  return Date.now() - new Date(savedAt).getTime() > getTtlMs();
}

async function getFromRedis(conversationId) {
  const key = buildStateKey(conversationId);
  const raw = await redisClient.get(key);
  if (!raw) return null;

  const parsed = JSON.parse(raw);
  if (isExpired(parsed.updatedAt)) {
    await redisClient.del(key);
    return null;
  }
  return ConversationStateDto.parse(parsed);
}

async function saveToRedis(conversationId, state) {
  const key = buildStateKey(conversationId);
  await redisClient.setEx(key, getTtlSeconds(), serializeState(state));
}

async function getFromMemory(conversationId) {
  const entry = memoryStore.get(conversationId);
  if (!entry || isExpired(entry.updatedAt)) {
    const next = getDefaultState();
    memoryStore.set(conversationId, next);
    return next;
  }
  return ConversationStateDto.parse(entry);
}

async function saveToMemory(conversationId, state) {
  pruneMemoryStoreIfNeeded();
  memoryStore.set(conversationId, state);
}

async function getState(conversationId) {
  if (env.CONVERSATION_STATE_BACKEND === "redis") {
    const fromRedis = await getFromRedis(conversationId);
    if (fromRedis) return fromRedis;

    const next = getDefaultState();
    await saveToRedis(conversationId, next);
    return next;
  }

  return getFromMemory(conversationId);
}

async function saveState(conversationId, state) {
  if (env.CONVERSATION_STATE_BACKEND === "redis") {
    await saveToRedis(conversationId, state);
    return;
  }
  await saveToMemory(conversationId, state);
}

export async function getConversationState(conversationId) {
  return getState(conversationId);
}

export async function patchConversationState(conversationId, patchInput) {
  const patch = ConversationStatePatchDto.parse(patchInput);
  const prev = await getConversationState(conversationId);

  const next = {
    ...prev,
    ...patch,
    updatedAt: nowIso(),
  };

  if (Array.isArray(patch.clearKeys)) {
    for (const key of patch.clearKeys) {
      next[key] = null;
    }
  }

  const parsed = ConversationStateDto.parse(next);
  await saveState(conversationId, parsed);
  return parsed;
}

export async function replaceConversationState(conversationId, nextStateInput) {
  const parsed = ConversationStateDto.parse({
    ...nextStateInput,
    updatedAt: nowIso(),
  });
  await saveState(conversationId, parsed);
  return parsed;
}

export async function clearConversationState(conversationId) {
  if (env.CONVERSATION_STATE_BACKEND === "redis") {
    await redisClient.del(buildStateKey(conversationId));
    return;
  }
  memoryStore.delete(conversationId);
}

export async function clearAllConversationStateForTests() {
  if (env.CONVERSATION_STATE_BACKEND === "redis") {
    return;
  }
  memoryStore.clear();
}
