import { View, Text, Image } from "react-native";
import { styles } from "./styles/AiUserBubble.styles";

export default function AiUserBubble({ message }) {
  return (
    <View
      style={styles.container}
    >
      <View style={styles.row}>
        <View
          style={styles.messageContainer}
        >
          <Text style={styles.text}>
            {message.text}
          </Text>
        </View>

        <Text style={styles.timeText}>
          {message.time}
        </Text>
      </View>

      <Image
        source={{ uri: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg" }}
        style={styles.image}
      />
    </View>
  );
}