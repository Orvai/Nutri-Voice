import { View, Text, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function NutritionSupplements({ supplements }) {
  return (
    <View
      style={{
        backgroundColor: "#ecfdf5",
        borderColor: "#a7f3d0",
        borderWidth: 1,
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 6 }}>
          <Ionicons name="medical-outline" size={18} color="#0f766e" />
          <Text style={{ fontWeight: "700", color: "#0f766e" }}>
            ויטמינים ותוספים נלווים
          </Text>
        </View>

        <Pressable
          style={{
            flexDirection: "row-reverse",
            gap: 6,
            backgroundColor: "#cffafe",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 8,
          }}
        >
          <Ionicons name="add" size={16} color="#0f766e" />
          <Text style={{ color: "#0f766e", fontSize: 12, fontWeight: "600" }}>
            הוסף תוסף
          </Text>
        </Pressable>
      </View>

      {supplements.map((s) => (
        <View
          key={s.id}
          style={{
            flexDirection: "row-reverse",
            backgroundColor: "white",
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#99f6e4",
            marginBottom: 10,
            alignItems: "center",
            gap: 10,
          }}
        >
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: "#14b8a6",
            }}
          />

          <Text style={{ flex: 1 }}>{s.name}</Text>

          <TextInput
            value={s.dosage}
            style={{
              width: 70,
              backgroundColor: "#f9fafb",
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "#d1d5db",
              textAlign: "center",
              paddingVertical: 4,
              fontSize: 12,
            }}
          />

          <Text style={{ fontSize: 12, color: "#6b7280" }}>{s.timing}</Text>

          <Ionicons name="close" size={18} color="#dc2626" />
        </View>
      ))}
    </View>
  );
}
