import React from "react";
import { View, ActivityIndicator, Text } from "react-native";

import { styles } from "../../styles";
import type { UIConversation } from "../../../../types/ui/conversation/conversation.ui";
import ConversationPreviewCard from "./ConversationPreviewCard";

export default function InboxPreviewSection({
  loading,
  conversations,
}: {
  loading: boolean;
  conversations: UIConversation[];
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
        <Text style={styles.title}>אין שיחות עדיין</Text>
        <Text style={[styles.text, { marginTop: 6 }]}>ברגע שייכנסו הודעות – הן יופיעו כאן.</Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      {conversations.map((c) => (
        <ConversationPreviewCard key={c.id} conversation={c} />
      ))}
    </View>
  );
}
