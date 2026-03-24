import { patchConversationState } from "./conversationState.service.js";

function nowIso() {
  return new Date().toISOString();
}

export function getPreviousResponseIdFromConversationState(state) {
  const session = state?.openai_response;
  if (!session) return null;
  if (session.provider !== "responses") return null;
  if (session.chainStatus !== "OPEN") return null;
  if (session.lastStatus !== "completed") return null;
  if (!session.lastResponseId) return null;
  return session.lastResponseId;
}

export async function rememberResponsesMeta({ conversationId, llmMeta }) {
  if (llmMeta?.provider !== "responses") return;

  const nextStatus =
    llmMeta?.status === "completed" ||
    llmMeta?.status === "incomplete" ||
    llmMeta?.status === "failed"
      ? llmMeta.status
      : "unknown";

  await patchConversationState(conversationId, {
    openai_response: {
      provider: "responses",
      lastResponseId: llmMeta?.responseId || null,
      lastStatus: nextStatus,
      chainStatus: nextStatus === "failed" ? "CLOSED" : "OPEN",
      updatedAt: nowIso(),
    },
  });
}

export async function clearResponsesChain(conversationId) {
  await patchConversationState(conversationId, {
    openai_response: null,
  });
}
