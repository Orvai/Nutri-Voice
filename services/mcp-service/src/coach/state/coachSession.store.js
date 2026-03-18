import { env } from "../../config/env.js";
import {
  CoachSessionStateDto,
  CoachSessionStatePatchDto,
} from "../../dtos/coachSessionState.dto.js";
import { MiniRedisClient } from "../../state/redis/miniRedisClient.js";

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

function keyFor(conversationId) {
  return `${env.CONVERSATION_STATE_KEY_PREFIX}:coach:${conversationId}`;
}

function isExpired(updatedAt) {
  if (!updatedAt) return true;
  return Date.now() - new Date(updatedAt).getTime() > getTtlMs();
}

function defaultState() {
  return CoachSessionStateDto.parse({
    activeClient: null,
    pendingClarification: null,
    lastOverview: null,
    updatedAt: nowIso(),
  });
}

async function loadState(conversationId) {
  if (env.CONVERSATION_STATE_BACKEND === "redis") {
    const raw = await redisClient.get(keyFor(conversationId));
    if (!raw) {
      const initial = defaultState();
      await redisClient.setEx(keyFor(conversationId), getTtlSeconds(), JSON.stringify(initial));
      return initial;
    }

    const parsed = CoachSessionStateDto.parse(JSON.parse(raw));
    if (isExpired(parsed.updatedAt)) {
      const initial = defaultState();
      await redisClient.setEx(keyFor(conversationId), getTtlSeconds(), JSON.stringify(initial));
      return initial;
    }
    return parsed;
  }

  const existing = memoryStore.get(conversationId);
  if (!existing || isExpired(existing.updatedAt)) {
    const initial = defaultState();
    memoryStore.set(conversationId, initial);
    return initial;
  }
  return CoachSessionStateDto.parse(existing);
}

async function saveState(conversationId, state) {
  if (env.CONVERSATION_STATE_BACKEND === "redis") {
    await redisClient.setEx(keyFor(conversationId), getTtlSeconds(), JSON.stringify(state));
    return;
  }
  memoryStore.set(conversationId, state);
}

export async function getCoachSessionState(conversationId) {
  return loadState(conversationId);
}

export async function patchCoachSessionState(conversationId, patchInput) {
  const patch = CoachSessionStatePatchDto.parse(patchInput);
  const prev = await loadState(conversationId);

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

  const parsed = CoachSessionStateDto.parse(next);
  await saveState(conversationId, parsed);
  return parsed;
}

export async function clearCoachSessionState(conversationId) {
  if (env.CONVERSATION_STATE_BACKEND === "redis") {
    await redisClient.del(keyFor(conversationId));
    return;
  }
  memoryStore.delete(conversationId);
}

export async function clearAllCoachSessionStateForTests() {
  if (env.CONVERSATION_STATE_BACKEND === "memory") {
    memoryStore.clear();
  }
}
