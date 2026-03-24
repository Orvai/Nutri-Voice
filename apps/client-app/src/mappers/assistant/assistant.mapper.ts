import type { AssistantStateDto } from "@/types/assistant/assistant.dto";
import type { AssistantState } from "@/types/assistant/assistant.ui";
import { formatTime } from "@/utils/format";

export const mapAssistantStateToUI = (dto: AssistantStateDto): AssistantState => ({
  pendingCoachReply: dto.pendingCoachReply,
  lastAction: dto.lastAction,
  messages: dto.messages.map((message) => ({
    id: message.id,
    role: message.role,
    text: message.text,
    kind: message.kind,
    createdAtLabel: formatTime(message.createdAtIso)
  }))
});
