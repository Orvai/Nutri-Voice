import { getConversationState } from "../state/conversationState.service.js";
import { normalizeUserGender } from "../profile/userProfile.js";

export async function createRuntimeContext({
  conversationId,
  messageId,
  sender,
  clientId,
  userId,
  userGender,
  requestAudit,
}) {
  return {
    conversationId,
    messageId,
    sender,
    clientId,
    userId: sender === "coach" ? userId : clientId,
    audit: {
      requestId: requestAudit?.requestId || null,
      actorId: requestAudit?.actorId || (sender === "coach" ? userId : clientId),
      clientId: requestAudit?.clientId || clientId || null,
      toolName: null,
    },
    userProfile: {
      gender: normalizeUserGender(userGender),
    },
    dailyState: undefined,
    conversationState: await getConversationState(conversationId),
  };
}
