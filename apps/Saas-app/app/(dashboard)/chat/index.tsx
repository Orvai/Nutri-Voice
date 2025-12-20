// ChatScreen.tsx
import React, { useMemo, useState, useEffect } from "react";
import { View } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

import ChatList from "@/components/chat/ChatList";
import ChatMessages from "@/components/chat/ChatMessages";
import ChatHeader from "@/components/chat/ChatHeader";
import ChatInput from "@/components/chat/ChatInput";
import ClientDetails from "@/components/chat/ClientDetails";

import { useCoachConversations } from "@/hooks/coversation/useCoachConversations";
import { useConversation } from "@/hooks/coversation/useConversation";
import { useConversationMessages } from "@/hooks/coversation/useConversationMessages";
import { useSendCoachMessage } from "@/hooks/coversation/useSendCoachMessage";
import { useMarkMessageHandled } from "@/hooks/coversation/useMarkMessageHandled";

import { useClients } from "@/hooks/clients/useClients";
import { conversationKeys } from "@/queryKeys/conversationKeys";

export default function ChatScreen() {
  const qc = useQueryClient();

  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  /* =========================
     Conversations list
  ========================= */
  const { data: conversations = [] } = useCoachConversations();
  console.log("conversations from hook:", conversations);


  /* =========================
     Active conversation meta
  ========================= */
  const { data: conversation } = useConversation(activeConversationId ?? "");

  /* =========================
     Messages
  ========================= */
  const { data: messages = [] } = useConversationMessages(activeConversationId ?? "");

  /* =========================
     Clients directory
  ========================= */
  const { data: clients = [] } = useClients();

  const activeClient = useMemo(() => {
    if (!conversation) return null;
    return clients.find((c) => c.id === conversation.clientId) ?? null;
  }, [conversation, clients]);

  /* =========================
     Pending client message
     (AI suggested reply lives here)
  ========================= */
  const pendingClientMessage = useMemo(() => {
    return (
      messages.find(
        (m) => m.sender === "CLIENT" && m.handledBy === null
      ) ?? null
    );
  }, [messages]);

  const suggestedText = pendingClientMessage?.aiSuggestedReply ?? "";

  /* =========================
     Draft (controlled input)
  ========================= */
  const [draft, setDraft] = useState("");

  useEffect(() => {
    setDraft(suggestedText);
  }, [suggestedText]);

  /* =========================
     Mutations
  ========================= */
  const sendCoachMessage = useSendCoachMessage(activeConversationId ?? "");
  const markMessageHandled = useMarkMessageHandled(activeConversationId);

  const handleSend = async (text: string) => {
    if (!activeConversationId) return;
    if (!pendingClientMessage) return;

    const trimmed = text.trim();
    if (!trimmed) return;

    // 1) send coach reply
    await sendCoachMessage.mutateAsync({
      contentType: "TEXT",
      text: trimmed,
    });

    // 2) mark client message as handled
    await markMessageHandled.mutateAsync({messageId: pendingClientMessage.id,handledBy: "COACH"});
    // 3) refresh messages so handledBy updates in UI
    await qc.invalidateQueries({
      queryKey: conversationKeys.messages(activeConversationId),
    });

    // 4) clear draft
    setDraft("");
  };

  /* =========================
     Render
  ========================= */
  return (
    <View style={{ flex: 1, flexDirection: "row-reverse" }}>
      <ChatList
        conversations={conversations}
        clients={clients}
        activeId={activeConversationId}
        onSelect={(convId) => setActiveConversationId(convId)}
      />

      <View style={{ flex: 1, flexDirection: "column" }}>
        <ChatHeader client={activeClient} />

        <ChatMessages
          messages={messages}
          aiSuggestedText={suggestedText}
          showSuggestion={!!pendingClientMessage}
          onSend={handleSend}
        />

        <ChatInput
          value={draft}
          onChange={setDraft}
          onSend={handleSend}
          disabled={!pendingClientMessage}
        />
      </View>

      <ClientDetails client={activeClient} />
    </View>
  );
}
