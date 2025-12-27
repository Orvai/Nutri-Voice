import React, { useMemo, useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
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
  const { clientId } = useLocalSearchParams<{ clientId: string }>();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  /* =========================
      Conversations list
  ========================= */
  const { data: conversations = [], isLoading: loadingConvs } = useCoachConversations();
  useEffect(() => {
    if (loadingConvs || conversations.length === 0) return;
    if (clientId) {
      const target = conversations.find(c => c.clientId === clientId);
      if (target && target.id !== activeConversationId) {
        setActiveConversationId(target.id);
        return;
      }
    }
    if (!activeConversationId && !clientId) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, clientId, loadingConvs]); 
  const { data: conversation } = useConversation(activeConversationId ?? "");
  const { data: messages = [] } = useConversationMessages(activeConversationId ?? "");
  const { data: clients = [] } = useClients();
  const activeClient = useMemo(() => {
    if (!conversation) return null;
    return clients.find((c) => c.id === conversation.clientId) ?? null;
  }, [conversation, clients]);
  const pendingClientMessage = useMemo(() => {
    return messages.find((m) => m.sender === "CLIENT" && m.handledBy === null) ?? null;
  }, [messages]);
  const suggestedText = pendingClientMessage?.aiSuggestedReply ?? "";
  const [draft, setDraft] = useState("");
  useEffect(() => {setDraft(suggestedText);}, [suggestedText]);
  const sendCoachMessage = useSendCoachMessage(activeConversationId ?? "");
  const markMessageHandled = useMarkMessageHandled(activeConversationId);
  /* =========================
      handleSend 
  ========================= */
  const handleSend = async (text: string) => {
    if (!activeConversationId) return;
    const trimmed = text.trim();
    if (!trimmed) return;
    await sendCoachMessage.mutateAsync({
      contentType: "TEXT",
      text: trimmed,
    });
    if (pendingClientMessage) {
      await markMessageHandled.mutateAsync({
        messageId: pendingClientMessage.id,
        handledBy: "COACH"
      });
    }
    await qc.invalidateQueries({
      queryKey: conversationKeys.messages(activeConversationId),
    });
    setDraft("");
  };
  if (loadingConvs && conversations.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }
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
          disabled={!activeConversationId} 
        />
      </View>
      <ClientDetails client={activeClient} />
    </View>
  );
}