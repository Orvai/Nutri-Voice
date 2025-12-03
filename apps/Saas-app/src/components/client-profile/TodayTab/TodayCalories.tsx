import { View, Text } from "react-native";

export default function TodayCalories({ data }) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 16,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
        קלוריות יומיות
      </Text>

      <Text style={{ textAlign: "center", fontSize: 26, fontWeight: "700" }}>
        {data.consumed} קל'
      </Text>

      <Text style={{ textAlign: "center", color: "#6b7280", marginBottom: 12 }}>
        יעד יומי: {data.target}
      </Text>

      <View style={{ gap: 6 }}>
        <MacroRow label="פחמימות" eaten={data.carbs.eaten} target={data.carbs.target} color="#2563eb" />
        <MacroRow label="חלבון" eaten={data.protein.eaten} target={data.protein.target} color="#22c55e" />
        <MacroRow label="שומן" eaten={data.fat.eaten} target={data.fat.target} color="#f97316" />
      </View>

      <Text style={{ textAlign: "center", color: "#6b7280", marginTop: 16, fontSize: 12 }}>
        עדכון אחרון: {data.lastUpdate}
      </Text>
    </View>
  );
}

function MacroRow({ label, eaten, target, color }) {
  return (
    <View
      style={{
        flexDirection: "row-reverse",
        justifyContent: "space-between",
        backgroundColor: color + "20",
        padding: 8,
        borderRadius: 10,
      }}
    >
      <Text style={{ color }}>{label}</Text>
      <Text style={{ color }}>{eaten}g / {target}g</Text>
    </View>
  );
}
