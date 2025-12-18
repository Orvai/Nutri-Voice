import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/TodayMeals.styles";

export default function TodayMeals({ meals }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>דיווחי ארוחות</Text>

      {meals.map((m) => (
        <View key={m.id} style={styles.meal}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Ionicons name={m.icon} size={20} color="#555" />
              <Text style={{ fontWeight: "700" }}>{m.title}</Text>
            </View>

            {m.fromPlan && (
              <Text style={styles.badge}>מהתפריט</Text>
            )}
          </View>

          <Text style={styles.muted}>דווח ב־{m.time}</Text>
          <Text style={styles.description}>{m.description}</Text>

          <View style={styles.footer}>
            <Text style={styles.footerText}>🔥 {m.calories} קל'</Text>
            <Text style={styles.footerText}>חלבון: {m.protein}g</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
