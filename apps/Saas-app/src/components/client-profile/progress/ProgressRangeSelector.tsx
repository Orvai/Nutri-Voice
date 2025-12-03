import { View, Text, Pressable } from "react-native";
import { useClientProgress } from "../../../hooks/useClientProgress";

export default function ProgressRangeSelector() {
  const { range, setRange } = useClientProgress();

  const ranges = [
    { label: "7 ימים", value: 7 },
    { label: "14 ימים", value: 14 },
    { label: "30 ימים", value: 30 },
    { label: "90 ימים", value: 90 },
    { label: "6 חודשים", value: 180 },
  ];

  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        padding: 16,
        marginBottom: 20,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
        התקדמות לטווח ארוך
      </Text>

      <View style={{ flexDirection: "row-reverse", flexWrap: "wrap", gap: 8 }}>
        {ranges.map((r) => (
          <Pressable
            key={r.value}
            onPress={() => setRange(r.value)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 8,
              backgroundColor: range === r.value ? "#2563eb" : "#f3f4f6",
            }}
          >
            <Text
              style={{
                color: range === r.value ? "#fff" : "#374151",
                fontWeight: "600",
              }}
            >
              {r.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
