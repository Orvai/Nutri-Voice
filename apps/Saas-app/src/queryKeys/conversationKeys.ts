export const conversationKeys = {
  all: ["conversations"] as const,

  listByCoach: (coachId: string) =>
    [...conversationKeys.all, "list", "coach", coachId] as const,

  inbox: () =>
    [...conversationKeys.all, "inbox"] as const,

  conversation: (id: string) =>
    [...conversationKeys.all, "conversation", id] as const,

  messages: (id: string) =>
    [...conversationKeys.all, "messages", id] as const,
};
