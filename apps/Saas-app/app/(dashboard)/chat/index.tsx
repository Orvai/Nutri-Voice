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
import { usePendingInboxMessages } from "@/hooks/coversation/usePendingInboxMessages";
import { useSendCoachMessage } from "@/hooks/coversation/useSendCoachMessage";
import { useMarkMessageHandled } from "@/hooks/coversation/useMarkMessageHandled";
import { useClients } from "@/hooks/clients/useClients";
import { conversationKeys } from "@/queryKeys/conversationKeys";

type ChatClientFilter = "all" | "active" | "inactive";

function isClientActive(status: string | null | undefined) {
  return String(status || "active").toLowerCase() === "active";
}

export default function ChatScreen() {
  const qc = useQueryClient();
  const { clientId } = useLocalSearchParams<{ clientId: string }>();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [clientFilter, setClientFilter] = useState<ChatClientFilter>("all");
  /* =========================
      Conversations list
  ========================= */
  const { data: conversations = [], isLoading: loadingConvs } = useCoachConversations();
  const { data: pendingInboxMessages = [] } = usePendingInboxMessages();

  const waitingConversationIds = useMemo(() => {
    return new Set(
      pendingInboxMessages
        .filter((message) => message.sender === "CLIENT" && message.handledBy === null)
        .map((message) => message.conversationId)
    );
  }, [pendingInboxMessages]);

  const latestPendingByConversation = useMemo(() => {
    const map = new Map<string, number>();

    for (const message of pendingInboxMessages) {
      if (message.sender !== "CLIENT" || message.handledBy !== null) continue;
      const createdAtTs = new Date(message.createdAt).getTime();
      if (!Number.isFinite(createdAtTs)) continue;

      const previous = map.get(message.conversationId) ?? 0;
      if (createdAtTs > previous) {
        map.set(message.conversationId, createdAtTs);
      }
    }

    return map;
  }, [pendingInboxMessages]);

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const aConversationTs = a.lastMessageAt
        ? new Date(a.lastMessageAt).getTime()
        : 0;
      const bConversationTs = b.lastMessageAt
        ? new Date(b.lastMessageAt).getTime()
        : 0;

      const aPendingTs = latestPendingByConversation.get(a.id) ?? 0;
      const bPendingTs = latestPendingByConversation.get(b.id) ?? 0;

      const aLatestTs = Math.max(Number.isFinite(aConversationTs) ? aConversationTs : 0, aPendingTs);
      const bLatestTs = Math.max(Number.isFinite(bConversationTs) ? bConversationTs : 0, bPendingTs);

      if (bLatestTs !== aLatestTs) {
        return bLatestTs - aLatestTs;
      }

      const aWaiting = waitingConversationIds.has(a.id) ? 1 : 0;
      const bWaiting = waitingConversationIds.has(b.id) ? 1 : 0;
      if (bWaiting !== aWaiting) {
        return bWaiting - aWaiting;
      }

      return a.id.localeCompare(b.id);
    });
  }, [conversations, latestPendingByConversation, waitingConversationIds]);

  const { data: clients = [] } = useClients({ statusFilter: "all" });

  const clientsById = useMemo(() => {
    return new Map(clients.map((client) => [client.id, client]));
  }, [clients]);

  const conversationsByFilter = useMemo(() => {
    return sortedConversations.filter((conversationItem) => {
      if (clientFilter === "all") {
        return true;
      }

      const clientForConversation = clientsById.get(conversationItem.clientId);
      if (!clientForConversation) {
        return false;
      }

      const active = isClientActive(clientForConversation.status);
      return clientFilter === "active" ? active : !active;
    });
  }, [sortedConversations, clientFilter, clientsById]);

  const filterCounts = useMemo(() => {
    let active = 0;
    let inactive = 0;

    for (const conversationItem of sortedConversations) {
      const clientForConversation = clientsById.get(conversationItem.clientId);
      if (!clientForConversation) {
        continue;
      }

      if (isClientActive(clientForConversation.status)) {
        active += 1;
      } else {
        inactive += 1;
      }
    }

    return {
      all: sortedConversations.length,
      active,
      inactive,
    };
  }, [sortedConversations, clientsById]);

  useEffect(() => {
    if (loadingConvs || conversationsByFilter.length === 0) return;

    if (clientId) {
      const target = conversationsByFilter.find((c) => c.clientId === clientId);
      if (target && target.id !== activeConversationId) {
        setActiveConversationId(target.id);
        return;
      }
    }

    const hasActiveConversation = activeConversationId
      ? conversationsByFilter.some((conversationItem) => conversationItem.id === activeConversationId)
      : false;

    if (!hasActiveConversation) {
      setActiveConversationId(conversationsByFilter[0].id);
    }
  }, [conversationsByFilter, clientId, loadingConvs, activeConversationId]);

  useEffect(() => {
    if (!loadingConvs && conversationsByFilter.length === 0) {
      setActiveConversationId(null);
    }
  }, [conversationsByFilter, loadingConvs]);

  const { data: conversation } = useConversation(activeConversationId ?? "");
  const { data: messages = [] } = useConversationMessages(activeConversationId ?? "");

  const activeClient = useMemo(() => {
    if (!conversation) return null;
    return clientsById.get(conversation.clientId) ?? null;
  }, [conversation, clientsById]);
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
        conversations={conversationsByFilter}
        clients={clients}
        waitingConversationIds={waitingConversationIds}
        activeId={activeConversationId}
        clientFilter={clientFilter}
        filterCounts={filterCounts}
        onClientFilterChange={setClientFilter}
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
