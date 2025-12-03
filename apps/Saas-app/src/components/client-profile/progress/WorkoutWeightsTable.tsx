import { View, Text } from "react-native";
import { useClientProgress } from "../../../hooks/useClientProgress";

export default function WorkoutWeightsTable() {
  const { data } = useClientProgress();

  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 20,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
        משקלי עבודה לפי תרגיל
      </Text>

      {data.workoutWeights.map((row, idx) => (
        <View
          key={idx}
          style={{
            paddingVertical: 12,
            borderBottomWidth: idx !== data.workoutWeights.length - 1 ? 1 : 0,
            borderColor: "#e5e7eb",
          }}
        >
          <Text style={{ fontWeight: "700" }}>{row.exercise}</Text>
          <Text>קבוצת שריר: {row.muscle}</Text>
          <Text>עבודה: {row.work}</Text>
          <Text>מקסימום: {row.max}</Text>
          <Text style={{ color: "#10b981" }}>שיפור: {row.progress}</Text>
          <Text style={{ color: "#6b7280" }}>תאריך: {row.date}</Text>
        </View>
      ))}
    </View>
  );
}
