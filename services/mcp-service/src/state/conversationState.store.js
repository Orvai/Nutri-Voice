import { ConversationStateDto, ConversationStatePatchDto } from "../dtos/conversationState.dto.js";
import { env } from "../config/env.js";

const store = new Map();

function nowIso() {
  return new Date().toISOString();
}

function getTtlMs() {
  return env.CONVERSATION_STATE_TTL_MIN * 60 * 1000;
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
    updatedAt: nowIso(),
  });
}

function pruneIfNeeded() {
  if (store.size < env.CONVERSATION_STATE_MAX_ENTRIES) return;

  const entries = [...store.entries()].sort(
    (a, b) => new Date(a[1].updatedAt).getTime() - new Date(b[1].updatedAt).getTime()
  );

  const toDelete = Math.max(1, entries.length - env.CONVERSATION_STATE_MAX_ENTRIES + 1);
  for (let i = 0; i < toDelete; i += 1) {
    store.delete(entries[i][0]);
  }
}

function isExpired(savedAt) {
  if (!savedAt) return true;
  return Date.now() - new Date(savedAt).getTime() > getTtlMs();
}

export function getConversationState(conversationId) {
  const entry = store.get(conversationId);
  if (!entry || isExpired(entry.updatedAt)) {
    const next = getDefaultState();
    store.set(conversationId, next);
    return next;
  }
  return ConversationStateDto.parse(entry);
}

export function patchConversationState(conversationId, patchInput) {
  const patch = ConversationStatePatchDto.parse(patchInput);
  const prev = getConversationState(conversationId);

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
  pruneIfNeeded();
  store.set(conversationId, parsed);
  return parsed;
}

export function replaceConversationState(conversationId, nextStateInput) {
  const parsed = ConversationStateDto.parse({
    ...nextStateInput,
    updatedAt: nowIso(),
  });
  pruneIfNeeded();
  store.set(conversationId, parsed);
  return parsed;
}

export function clearConversationState(conversationId) {
  store.delete(conversationId);
}

export function clearAllConversationStateForTests() {
  store.clear();
}
