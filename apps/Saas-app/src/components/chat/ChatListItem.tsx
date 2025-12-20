import { View, Text, Pressable, Image } from "react-native";
import { styles } from "./styles/ChatListItem.styles";

import type { UIConversation } from "@/types/ui/conversation/conversation.ui";
import type { ClientExtended } from "@/types/client";

interface Props {
  conversation: UIConversation;
  client: ClientExtended | null;
  active: boolean;
  onPress: () => void;
}




export default function ChatListItem({
  conversation,
  client,
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
        { backgroundColor: active ? "#e0ebff" : "#fff" },
      ]}
    >
      <Image source={avatarSource} style={styles.avatar} />


      <View style={styles.details}>
        <Text style={styles.name}>
          {client?.name ?? "לקוח לא ידוע"}
        </Text>

        {/* TODO: last message preview (יגיע מה-conversation בעתיד) */}
        <Text style={styles.lastMessage}>
          שיחה פעילה
        </Text>
      </View>

      {/* TODO: unread messages badge */}
    </Pressable>
  );
}
