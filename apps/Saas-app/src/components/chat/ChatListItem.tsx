import { View, Text, Pressable, Image } from "react-native";
import { styles } from "./styles/ChatListItem.styles";

export default function ChatListItem({ item, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.container, { backgroundColor: active ? "#e0ebff" : "#fff" }]}
    >
      <Image source={{ uri: item.avatar }} style={styles.avatar} />

      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.lastMessage}>
          {item.lastMessage}
        </Text>
      </View>

      {/* תג מצב */}
      {item.unread > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {item.unread}
          </Text>
        </View>
      )}
    </Pressable>
  );
}