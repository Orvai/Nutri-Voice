import { View, Text, Pressable, Image } from "react-native";
import { styles } from "./styles/ChatListItem.styles";

import type { UIConversation } from "@/types/ui/conversation/conversation.ui";
import type { ClientExtended } from "@/types/client";

interface Props {
  conversation: UIConversation;
  client: ClientExtended | null;
  waitingForReply: boolean;
  active: boolean;
  onPress: () => void;
}

function formatLastMessageAt(value: string | null): string {
  if (!value) return "ללא הודעות";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "שיחה פעילה";

  return date.toLocaleTimeString("he-IL", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function ChatListItem({
  conversation,
  client,
  waitingForReply,
  active,
  onPress,
}: Props) {
  const avatarSource = client?.profileImageUrl
  ? { uri: client.profileImageUrl }
  : {
      uri:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg",
    };

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        waitingForReply && styles.waitingContainer,
        active && styles.activeContainer,
      ]}
    >
      <Image source={avatarSource} style={styles.avatar} />


      <View style={styles.details}>
        <Text style={styles.name}>
          {client?.name ?? "לקוח לא ידוע"}
        </Text>

        <Text
          style={[
            styles.lastMessage,
            waitingForReply && styles.waitingMessage,
          ]}
        >
          {waitingForReply
            ? "ממתין למענה שלך"
            : `עדכון אחרון: ${formatLastMessageAt(conversation.lastMessageAt)}`}
        </Text>
      </View>

      {waitingForReply && (
        <View style={styles.waitingBadge}>
          <Text style={styles.waitingBadgeText}>חדש</Text>
        </View>
      )}
    </Pressable>
  );
}
