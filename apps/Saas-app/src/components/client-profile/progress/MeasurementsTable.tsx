import { View, Text } from "react-native";
import { useClientProgress } from "../../../hooks/useClientProgress";

export default function MeasurementsTable() {
  const { data } = useClientProgress();

  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 40,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 16 }}>
        מדידות גוף
      </Text>

      {data.measurements.map((row, idx) => (
        <View
          key={idx}
          style={{
            paddingVertical: 12,
            borderBottomWidth: idx !== data.measurements.length - 1 ? 1 : 0,
            borderColor: "#e5e7eb",
          }}
        >
          <Text style={{ fontWeight: "700" }}>{row.date}</Text>
          <Text>משקל: {row.weight} ק״ג</Text>
          <Text>אחוז שומן: {row.fat}</Text>
          <Text>מסת שריר: {row.muscle} ק״ג</Text>
          <Text>היקף מותניים: {row.waist} ס״מ</Text>
          <Text>חזה: {row.chest} ס״מ</Text>
        </View>
      ))}
    </View>
  );
}
