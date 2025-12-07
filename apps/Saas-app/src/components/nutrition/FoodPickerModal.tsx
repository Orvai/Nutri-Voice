import React, { useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useFood } from "../../hooks/nutrition/useFood";
import { FoodItem } from "../../types/api/nutrition-types/food.types";
import PickerItemCard from "../shared/PickerItemCard";

type Props = {
  visible: boolean;
  onClose: () => void;
  existingIds: string[];
  onSelect: (food: FoodItem) => void;
};

const categories = [
  "PROTEIN",
  "CARB",
  "FREE",
  "HEALTH",
  "MENTAL_HEALTH",
];

export default function FoodPickerModal({
  visible,
  onClose,
  existingIds,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const { data: allFood = [], isLoading } = useFood(search);

  const filteredFood = useMemo(() => {
    const withoutExisting = allFood.filter((f) => !existingIds.includes(f.id));
    const byCategory = category
      ? withoutExisting.filter((f) => f.category === category)
      : withoutExisting;

    return byCategory;
  }, [allFood, category, existingIds]);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.35)",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            borderRadius: 18,
            padding: 16,
            maxHeight: "85%",
            gap: 12,
          }}
        >
          <View
            style={{
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "800", fontSize: 18 }}>בחירת מוצר מזון</Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#ef4444" />
            </Pressable>
          </View>

          <TextInput
            placeholder="חיפוש מוצר..."
            value={search}
            onChangeText={setSearch}
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 10,
              textAlign: "right",
            }}
          />

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ flexDirection: "row-reverse", gap: 8 }}
          >
            <Pressable
              onPress={() => setCategory(null)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                backgroundColor: category === null ? "#0f766e" : "#f1f5f9",
                borderWidth: 1,
                borderColor: category === null ? "#0f766e" : "#e5e7eb",
              }}
            >
              <Text style={{ color: category === null ? "white" : "#0f172a" }}>
                הכל
              </Text>
            </Pressable>

            {categories.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                style={{
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: category === cat ? "#0f766e" : "#f1f5f9",
                  borderWidth: 1,
                  borderColor: category === cat ? "#0f766e" : "#e5e7eb",
                }}
              >
                <Text style={{ color: category === cat ? "white" : "#0f172a" }}>
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          <ScrollView style={{ flexGrow: 0 }}>
            {isLoading && (
              <Text style={{ textAlign: "center", color: "#6b7280", padding: 10 }}>
                טוען מוצרים...
              </Text>
            )}

            {!isLoading && filteredFood.length === 0 && (
              <Text style={{ textAlign: "center", color: "#6b7280", padding: 10 }}>
                לא נמצאו מוצרים
              </Text>
            )}

            {filteredFood.map((item) => (
              <PickerItemCard
                key={item.id}
                title={item.name}
                subtitle={
                  item.caloriesPer100g != null
                    ? `${item.caloriesPer100g} קק״ל ל־100 גרם`
                    : "אין מידע קלורי"
                }
                onPress={() => onSelect(item)}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}