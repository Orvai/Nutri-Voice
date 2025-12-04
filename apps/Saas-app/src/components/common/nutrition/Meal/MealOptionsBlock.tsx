import { View, Text, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MealOption } from "../../../../types/nutrition";

interface Props {
  options: MealOption[];
  selectedOptionId?: string | null;

  onSelectOption: (optionId: string | null) => void; // TODO: connect later
}

export default function MealOptionsBlock({
  options,
  selectedOptionId,
  onSelectOption,
}: Props) {
  return (
    <View style={{ gap: 8 }}>
      {options.map((opt) => {
        const selected = opt.id === selectedOptionId;

        return (
          <Pressable
            key={opt.id}
            onPress={() => onSelectOption(opt.id)}
            style={{
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 10,
              backgroundColor: selected ? "#dbeafe" : "#f8fafc",
              borderWidth: 1,
              borderColor: selected ? "#60a5fa" : "#e2e8f0",
              borderRadius: 8,
            }}
          >
            {/* Option Info */}
            <View style={{ flexDirection: "row-reverse", gap: 6 }}>
              <Ionicons
                name={selected ? "radio-button-on" : "radio-button-off"}
                size={18}
                color={selected ? "#2563eb" : "#64748b"}
              />
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: selected ? "700" : "500",
                  color: selected ? "#1e3a8a" : "#334155",
                }}
              >
                {opt.name || "Unnamed option"}
              </Text>
            </View>

            {/* Preview calories or items count if mealTemplate exists */}
            {opt.mealTemplate ? (
              <Text style={{ color: "#64748b", fontSize: 12 }}>
                {opt.mealTemplate.items.length} מוצרים
              </Text>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}
