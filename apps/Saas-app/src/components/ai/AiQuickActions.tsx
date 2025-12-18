import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/AiQuickActions.styles";

export default function AiQuickActions() {
    const actions = [
        { icon: "fast-food-outline", title: "צור תוכנית תזונה" },
        { icon: "analytics-outline", title: "נתח ביצועים" },
        { icon: "document-outline", title: "סכם דוחות" },
        { icon: "barbell-outline", title: "תוכנית אימון" },
    ]as const;

  return (
    <View style={styles.container}>
      {actions.map((a, i) => (
        <Pressable
          key={i}
          style={styles.button}
        >
          <View style={styles.row}>
            <View style={styles.icon}>
              <Ionicons name={a.icon} size={24} color="#2563eb" />
            </View>
            <Text style={styles.title}>
              {a.title}
            </Text>
          </View>

          <Text
            style={styles.text}
          >
            לחץ להתחלה
          </Text>
        </Pressable>
      ))}
    </View>
  );
}