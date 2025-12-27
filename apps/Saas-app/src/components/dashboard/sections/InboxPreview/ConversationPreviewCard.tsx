import React, { useMemo } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { styles } from "../../styles";
import { channelIcon, channelLabel, formatShortDateTime, timeAgo } from "../../utils";

import type { UIConversation } from "../../../../types/ui/conversation/conversation.ui";

import type { UIMessage } from "@/types/ui/conversation/message.ui"; 
import { useConversationMessages } from "../../../../hooks/coversation/useConversationMessages";
import { useMarkMessageHandled } from "../../../../hooks/coversation/useMarkMessageHandled";

function pickLastClientUnhandled(messages: UIMessage[] | undefined | null) {
  if (!messages?.length) return null;
  for (let i = messages.length - 1; i >= 0; i--) {
    const m = messages[i];
    if (m.sender === "CLIENT" && !m.handledAt) return m;
  }
  return null;
}

export default function ConversationPreviewCard({ conversation }: { conversation: UIConversation }) {
  const router = useRouter();

  const msgQ = useConversationMessages(conversation.id);
  const markHandled = useMarkMessageHandled(conversation.id);

  const lastMsg = useMemo(() => {
    const list = msgQ.data ?? [];
    return list.length ? list[list.length - 1] : null;
  }, [msgQ.data]);

  const lastClientUnhandled = useMemo(
    () => pickLastClientUnhandled(msgQ.data),
    [msgQ.data]
  );

  const needsCoach = !!lastClientUnhandled;
  const aiSuggested =
    lastClientUnhandled?.aiDecision === "COACH_REPLY" && !!lastClientUnhandled?.aiSuggestedReply;

    const openConversation = () => {
        router.push({
          pathname: "/chat",
          params: {
            clientId: conversation.clientId,
          },
        });
      };

  const onMarkHandled = () => {
    if (!lastClientUnhandled) return;
    markHandled.mutate({ messageId: lastClientUnhandled.id, handledBy: "COACH" });
  };

  return (
    <View style={[styles.card, needsCoach ? styles.cardAttention : null]}>
      <View style={[styles.rowReverse, { gap: 10, justifyContent: "space-between" }]}>
        <View style={[styles.rowReverse, { gap: 10, flex: 1 }]}>
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor: "rgba(17,24,39,0.06)",
              borderWidth: 1,
              borderColor: "rgba(17,24,39,0.08)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Ionicons name={channelIcon(conversation.channel) as any} size={16} color="#111827" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              {channelLabel(conversation.channel)} • {timeAgo(conversation.lastMessageAt)}
            </Text>
            <Text style={styles.meta}>עודכן: {formatShortDateTime(conversation.lastMessageAt)}</Text>
          </View>
        </View>

        <Pressable style={styles.ghostBtn} onPress={openConversation}>
          <Text style={styles.ghostBtnText}>פתח</Text>
        </Pressable>
      </View>

      {msgQ.isLoading ? (
        <View style={{ paddingTop: 10 }}>
          <ActivityIndicator />
        </View>
      ) : !lastMsg ? (
        <Text style={[styles.text, { paddingTop: 10 }]}>אין הודעות בשיחה עדיין</Text>
      ) : (
        <View style={{ paddingTop: 10, gap: 8 }}>
          {needsCoach ? (
            <View style={[styles.rowReverse, { gap: 8 }]}>
              <Text style={[styles.title, { fontSize: 12 }]}>דורש טיפול</Text>
              {aiSuggested ? <Text style={[styles.meta, { marginTop: 0 }]}>• יש הצעת AI</Text> : null}
            </View>
          ) : (
            <Text style={[styles.meta, { marginTop: 0 }]}>סטטוס: תקין</Text>
          )}

          <Text style={[styles.meta, { marginTop: 0 }]}>הודעה אחרונה</Text>
          <Text style={styles.text} numberOfLines={3}>
            {lastMsg.text || "תוכן מדיה"}
          </Text>

          {aiSuggested ? (
            <>
              <Text style={[styles.meta, { marginTop: 0 }]}>הצעת AI</Text>
              <Text style={styles.text} numberOfLines={3}>
                {lastClientUnhandled?.aiSuggestedReply}
              </Text>
            </>
          ) : null}

          {needsCoach ? (
            <Pressable
              style={[styles.secondaryBtn, { alignSelf: "flex-end", opacity: markHandled.isPending ? 0.6 : 1 }]}
              onPress={onMarkHandled}
              disabled={markHandled.isPending}
            >
              <Text style={styles.secondaryBtnText}>
                {markHandled.isPending ? "מסמן…" : "סמן טופל"}
              </Text>
            </Pressable>
          ) : null}
        </View>
      )}
    </View>
  );
}
