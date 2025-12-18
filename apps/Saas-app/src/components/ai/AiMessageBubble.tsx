import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/AiMessageBubble.styles";

export default function AiMessageBubble({ message }) {
  return (
    <View style={styles.container}>
      <View style={styles.icon}>
        <Ionicons name="sparkles" size={18} color="#fff" />
      </View>

      <View style={styles.row}>
        <View style={styles.messageContainer}>
          <Text style={styles.text}>
            {message.text}
          </Text>
        </View>

        <Text style={styles.timeText}>
          {message.time}
        </Text>
      </View>
    </View>
  );
}