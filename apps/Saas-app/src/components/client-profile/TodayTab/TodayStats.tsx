import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/TodayStats.styles";

export default function TodayStats({ stats }) {
  const safeStats = stats ?? [];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>מדדים יומיים</Text>

      <View style={styles.list}>
        {safeStats.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyText}>עדיין לא דווחו מדדים להיום.</Text>
          </View>
        ) : (
          safeStats.map((s) => {
            const isMissing = String(s?.value ?? "").includes("לא דווח");
            return (
              <View key={s.label} style={styles.row}>
                <View style={styles.rowLeft}>
                  <View style={styles.iconBubble}>
                    <Ionicons name={s.icon} size={16} color="#2563eb" />
                  </View>
                  <Text style={styles.label}>{s.label}</Text>
                </View>
                <Text style={[styles.value, isMissing && styles.valueMissing]}>{s.value}</Text>
              </View>
            );
          })
        )}
      </View>
    </View>
  );
}
