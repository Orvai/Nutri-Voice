import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/TodayStats.styles";

export default function TodayStats({ stats }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>מדדים יומיים</Text>

      <View style={styles.list}>
        {stats.map((s) => (
          <View key={s.label} style={styles.row}>
            <View style={styles.rowLeft}>
              <Ionicons name={s.icon} size={18} color="#2563eb" />
              <Text>{s.label}</Text>
            </View>
            <Text style={styles.value}>{s.value}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
