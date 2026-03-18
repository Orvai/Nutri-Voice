import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

import { styles } from "../../styles";
import type { UIConversation } from "../../../../types/ui/conversation/conversation.ui";
import type { UIMessage } from "@/types/ui/conversation/message.ui";
import ConversationPreviewCard from "./ConversationPreviewCard";

export default function InboxPreviewSection({
  loading,
  conversations,
  pendingByConversation,
}: {
  loading: boolean;
  conversations: UIConversation[];
  pendingByConversation: Map<string, UIMessage>;
}) {
  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!conversations.length) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>אין הודעות שממתינות לטיפול</Text>
        <Text style={[styles.text, { marginTop: 6 }]}>ברגע שתגיע הודעת לקוח חדשה היא תופיע כאן.</Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      {conversations.map((c) => (
        <ConversationPreviewCard
          key={c.id}
          conversation={c}
          pendingMessage={pendingByConversation.get(c.id) ?? null}
        />
      ))}
    </View>
  );
}
