import { View, Text, Image } from "react-native";
import { styles } from "./styles/ChatHeader.styles";

export default function ChatHeader({ conversation }) {
  if (!conversation) return null;

  return (
    <View style={styles.container}>
      <View style={styles.userRow}>
        <Image source={{ uri: conversation.avatar }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{conversation.name}</Text>
          <Text style={styles.status}>
            ● מחובר עכשיו
          </Text>
        </View>
      </View>
    </View>
  );
}