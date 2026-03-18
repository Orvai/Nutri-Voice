import React from "react";
import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { styles } from "../../styles";
import { channelIcon, channelLabel, formatShortDateTime, timeAgo } from "../../utils";

import type { UIConversation } from "../../../../types/ui/conversation/conversation.ui";
import type { UIMessage } from "@/types/ui/conversation/message.ui";

import { useMarkMessageHandled } from "../../../../hooks/coversation/useMarkMessageHandled";

type Props = {
  conversation: UIConversation;
  pendingMessage?: UIMessage | null;
};

function getMessagePreview(message: UIMessage | null | undefined): string {
  if (!message) return "אין כרגע הודעה ממתינה בשיחה.";
  if (message.text?.trim()) return message.text;

  switch (message.contentType) {
    case "IMAGE":
      return "נשלחה תמונה";
    case "AUDIO":
      return "נשלחה הודעת קול";
    case "VIDEO":
      return "נשלח וידאו";
    default:
      return "נשלחה הודעת מדיה";
  }
}

export default function ConversationPreviewCard({ conversation, pendingMessage = null }: Props) {
  const router = useRouter();
  const markHandled = useMarkMessageHandled(conversation.id);

  const needsCoach = !!pendingMessage;
  const aiSuggested =
    pendingMessage?.aiDecision === "COACH_REPLY" && !!pendingMessage?.aiSuggestedReply;

  const displayTime = pendingMessage?.createdAt ?? conversation.lastMessageAt;
  const previewText = getMessagePreview(pendingMessage);

  const openConversation = () => {
    router.push({
      pathname: "/chat",
      params: {
        clientId: conversation.clientId,
      },
    });
  };

  const onMarkHandled = () => {
    if (!pendingMessage) return;
    markHandled.mutate({ messageId: pendingMessage.id, handledBy: "COACH" });
  };

  return (
    <View style={[styles.card, needsCoach ? styles.cardAttention : null]}>
      <View style={[styles.rowReverse, { gap: 10, justifyContent: "space-between" }]}>
        <View style={[styles.rowReverse, { gap: 10, flex: 1 }]}> 
          <View style={styles.channelIconBubble}>
            <Ionicons name={channelIcon(conversation.channel) as any} size={16} color="#111827" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.title}>
              {channelLabel(conversation.channel)} • {timeAgo(displayTime)}
            </Text>
            <Text style={styles.meta}>עודכן: {formatShortDateTime(displayTime)}</Text>
          </View>
        </View>

        <Pressable style={styles.ghostBtn} onPress={openConversation}>
          <Text style={styles.ghostBtnText}>פתח</Text>
        </Pressable>
      </View>

      <View style={styles.inboxBody}>
        <View style={[styles.rowReverse, { gap: 8 }]}> 
          <View style={[styles.inboxStatusPill, needsCoach ? styles.inboxStatusNeedAction : styles.inboxStatusClear]}>
            <Text style={styles.inboxStatusText}>{needsCoach ? "דורש טיפול" : "תקין"}</Text>
          </View>
          {aiSuggested ? <Text style={[styles.meta, { marginTop: 0 }]}>יש הצעת AI</Text> : null}
        </View>

        <Text style={[styles.meta, { marginTop: 0 }]}>הודעת לקוח</Text>
        <Text style={styles.text} numberOfLines={3}>
          {previewText}
        </Text>

        {aiSuggested ? (
          <>
            <Text style={[styles.meta, { marginTop: 0 }]}>הצעת AI לתגובה</Text>
            <Text style={styles.text} numberOfLines={3}>
              {pendingMessage?.aiSuggestedReply}
            </Text>
          </>
        ) : null}

        <View style={[styles.rowReverse, { justifyContent: "space-between", marginTop: 4 }]}> 
          <Pressable style={styles.ghostBtn} onPress={openConversation}>
            <Text style={styles.ghostBtnText}>מעבר לצ׳אט</Text>
          </Pressable>

          {needsCoach ? (
            <Pressable
              style={[styles.secondaryBtn, { opacity: markHandled.isPending ? 0.6 : 1 }]}
              onPress={onMarkHandled}
              disabled={markHandled.isPending}
            >
              <Text style={styles.secondaryBtnText}>
                {markHandled.isPending ? "מסמן…" : "סמן טופל"}
              </Text>
            </Pressable>
          ) : null}
        </View>
      </View>
    </View>
  );
}
