import { View, Text, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UIVitamin } from "../../types/nutrition-ui";

type Props = {
  vitamins: UIVitamin[];
};

export default function NutritionSupplements({ vitamins }: Props) {
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
          onPress={() => {
            console.log("TODO: open add-vitamin flow");
          }}
        >
          <Ionicons name="add" size={16} color="#0f766e" />
          <Text style={{ color: "#0f766e", fontSize: 12, fontWeight: "600" }}>
            הוסף תוסף
          </Text>
        </Pressable>
      </View>

      {vitamins.map((v) => (
        <View
          key={v.id}
          style={{
            backgroundColor: "white",
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#99f6e4",
            marginBottom: 10,
            gap: 8,
          }}
        >
          <Text style={{ fontWeight: "600" }}>{v.name}</Text>

          <TextInput
            multiline
            value={v.description ?? ""}
            placeholder="Description..."
            style={{
              backgroundColor: "#f9fafb",
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "#d1d5db",
              paddingHorizontal: 8,
              paddingVertical: 6,
              fontSize: 12,
              textAlignVertical: "top",
              minHeight: 40,
            }}
          />
        </View>
      ))}
    </View>
  );
}
