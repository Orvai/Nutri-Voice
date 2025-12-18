import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/AiWelcome.styles";

export default function AiWelcome() {
  return (
    <View style={styles.container}>
      <View
        style={styles.icon}
      >
        <Ionicons name="sparkles" size={32} color="#2563eb" />
      </View>

      <Text style={styles.title}>
        שלום! אני העוזר האישי שלך
      </Text>

      <Text
        style={styles.text}
      >
        אני כאן כדי לעזור לך לנהל לקוחות, לנתח נתונים וליצור תוכניות מותאמות אישית
      </Text>
    </View>
  );
}