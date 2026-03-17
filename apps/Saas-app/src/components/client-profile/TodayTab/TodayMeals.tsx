import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/TodayMeals.styles";

export default function TodayMeals({ meals }) {
  const totalMeals = meals?.length ?? 0;
  const totalCalories = (meals ?? []).reduce((sum, meal) => sum + Number(meal?.calories ?? 0), 0);
  const totalProtein = (meals ?? []).reduce((sum, meal) => sum + Number(meal?.protein ?? 0), 0);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>דיווחי ארוחות</Text>

      <View style={styles.summaryRow}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{totalMeals}</Text>
          <Text style={styles.summaryLabel}>ארוחות</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{totalCalories.toLocaleString()}</Text>
          <Text style={styles.summaryLabel}>קלוריות</Text>
        </View>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{totalProtein}g</Text>
          <Text style={styles.summaryLabel}>חלבון</Text>
        </View>
      </View>

      {meals.map((m) => (
        <View key={m.id} style={styles.meal}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.iconBubble}>
                <Ionicons name={m.icon} size={16} color="#0f172a" />
              </View>
              <Text style={styles.mealTitle}>{m.title}</Text>
            </View>

            {m.fromPlan && (
              <Text style={styles.badge}>מהתפריט</Text>
            )}
          </View>

          <Text style={styles.muted}>דווח ב־{m.time || "—:—"}</Text>
          <Text style={styles.description}>{m.description || "ללא תיאור"}</Text>

          <View style={styles.footer}>
            <View style={styles.metricChip}>
              <Text style={styles.footerText}>🔥 {Number(m.calories ?? 0).toLocaleString()} קל'</Text>
            </View>
            <View style={styles.metricChip}>
              <Text style={styles.footerText}>חלבון: {Number(m.protein ?? 0)}g</Text>
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
