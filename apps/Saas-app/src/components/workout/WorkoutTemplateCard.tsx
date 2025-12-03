import { View, Text, Pressable } from "react-native";

export default function WorkoutTemplateCard({ item }) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        borderRadius: 14,
        padding: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 14,
      }}
    >
      <View style={{ flexDirection: "row-reverse", alignItems: "center" }}>
        <View
          style={{
            width: 40,
            height: 40,
            backgroundColor: item.color + "20",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 8,
            marginLeft: 12,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              color: item.color,
              fontWeight: "700",
            }}
          >
            {item.label}
          </Text>
        </View>

        <View>
          <Text style={{ fontSize: 16, fontWeight: "700" }}>{item.name}</Text>
          <Text style={{ fontSize: 12, color: "#6b7280" }}>
            {item.description}
          </Text>
        </View>
      </View>

      {/* Tags */}
      <View
        style={{
          flexDirection: "row-reverse",
          flexWrap: "wrap",
          gap: 6,
          marginTop: 12,
        }}
      >
        {item.muscles.map((m, i) => (
          <Text
            key={i}
            style={{
              fontSize: 12,
              backgroundColor: "#f3f4f6",
              paddingVertical: 4,
              paddingHorizontal: 8,
              borderRadius: 6,
              color: "#374151",
            }}
          >
            {m}
          </Text>
        ))}
      </View>
    </View>
  );
}
