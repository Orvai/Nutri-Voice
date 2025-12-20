import { View, Text, Image } from "react-native";
import { styles } from "./styles/ChatHeader.styles";

import type { ClientExtended } from "@/types/client";

interface Props {
  client: ClientExtended | null;
}

export default function ChatHeader({ client }: Props) {
  if (!client) return null;

  const avatarSource = client?.profileImageUrl
    ? { uri: client.profileImageUrl }
    : {
        uri:
          "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg",
      };

  return (
    <View style={styles.container}>
      <View style={styles.userRow}>
        <Image source={avatarSource} style={styles.avatar} />
        <Text style={styles.name}>{client.name}</Text>
      </View>
    </View>
  );
}
