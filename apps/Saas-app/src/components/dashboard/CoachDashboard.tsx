import React, { useMemo, useState, useCallback } from "react";
import { ScrollView, View, RefreshControl } from "react-native";
import { useQueryClient } from "@tanstack/react-query";

import { styles } from "./styles";

import CoachDashboardHeader from "./CoachDashboardHeader";
import Section from "./sections/Section";

import InboxPreviewSection from "./sections/InboxPreview/InboxPreviewSection";
import ClientsSnapshotSection from "./sections/ClientsSnapshot/ClientsSnapshotSection";
import MissingTodaySection from "./sections/MissingToday/MissingTodaySection";

import { useClients } from "@/hooks/clients/useClients";
import { useCoachConversations } from "../../hooks/coversation/useCoachConversations";

import { clientKeys } from "@/queryKeys/clientKeys";
import { conversationKeys } from "@/queryKeys/conversationKeys";
import { trackingKeys } from "@/queryKeys/trackingKeys";

const RECENT_CONVERSATIONS_LIMIT = 6;
const CLIENTS_SCAN_STEP = 10;

export default function CoachDashboard() {
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [scanLimit, setScanLimit] = useState(CLIENTS_SCAN_STEP);

  const clientsQ = useClients();
  const convQ = useCoachConversations(undefined);

  const clients = clientsQ.data ?? [];
  const conversations = convQ.data ?? [];

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => (c.name || "").toLowerCase().includes(q));
  }, [clients, search]);

  const scanClients = useMemo(
    () => filteredClients.slice(0, scanLimit),
    [filteredClients, scanLimit]
  );

  const recentConversations = useMemo(() => {
    const sorted = [...conversations].sort((a, b) => {
      const at = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bt = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bt - at;
    });
    return sorted.slice(0, RECENT_CONVERSATIONS_LIMIT);
  }, [conversations]);

  const onLoadMoreClients = () => setScanLimit((x) => x + CLIENTS_SCAN_STEP);

  const refresh = useCallback(async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: clientKeys.list(), exact: false }),
      qc.invalidateQueries({ queryKey: conversationKeys.all, exact: false }),
      qc.invalidateQueries({ queryKey: trackingKeys.dailyState(), exact: false }),
    ]);
  }, [qc]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.page}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={clientsQ.isFetching || convQ.isFetching}
          onRefresh={refresh}
        />
      }
    >
      <CoachDashboardHeader
        totalClients={clients.length}
        totalConversations={conversations.length}
        search={search}
        onChangeSearch={setSearch}
      />

      <Section
        title="Inbox – מה דורש טיפול"
        subtitle={`מציג ${RECENT_CONVERSATIONS_LIMIT} שיחות אחרונות (בשביל ביצועים)`}
      >
        <InboxPreviewSection loading={convQ.isLoading} conversations={recentConversations} />
      </Section>

      <Section title="לקוחות – תמונת מצב מהירה" subtitle="דיווח היום + קלוריות/יעד/אימונים">
        <ClientsSnapshotSection
          loading={clientsQ.isLoading}
          clients={scanClients}
          onLoadMore={onLoadMoreClients}
        />
      </Section>

      <Section title="מי לא דיווח היום" subtitle="סריקה מדורגת (לא מעמיס)">
        <MissingTodaySection clients={scanClients} onScanMore={onLoadMoreClients} />
      </Section>

      <View style={{ height: 26 }} />
    </ScrollView>
  );
}
