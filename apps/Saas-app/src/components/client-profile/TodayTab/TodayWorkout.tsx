import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "../styles/TodayWorkout.styles";

export default function TodayWorkout({ workout }) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>אימון היום</Text>
        <Text
          style={[
            styles.status,
            {
              backgroundColor: "#ecfdf5",
              color: "#0f766e",
            },
          ]}
        >
          {workout.done ? "הושלם" : "לא הושלם"}
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <View style={styles.iconBox}>
            <Ionicons name="barbell" size={20} color="#2563eb" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: "700" }}>{workout.title}</Text>
            <Text style={styles.muted}>{workout.time}</Text>
          </View>
        </View>

        <View style={styles.boxesRow}>
          <Box label="משך" value={workout.duration} />
          <Box label="קלוריות" value={workout.calories} />
        </View>
      </View>
    </View>
  );
}

function Box({ label, value }) {
  return (
    <View style={styles.box}>
      <Text style={{ fontSize: 12, color: "#6b7280" }}>{label}</Text>
      <Text style={{ fontSize: 14, fontWeight: "700" }}>{value}</Text>
    </View>
  );
}
