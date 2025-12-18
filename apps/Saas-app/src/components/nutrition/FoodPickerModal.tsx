import React, { useMemo, useState } from "react";
import { Modal, View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useFood } from "@/hooks/nutrition/useFood";
import { Food } from "@/types/ui/nutrition/food.ui";
import PickerItemCard from "../shared/PickerItemCard";
import { styles } from "./styles/FoodPickerModal.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
  existingIds: string[];
  onSelect: (food: Food) => void;
};

const categories = [
  "PROTEIN",
  "CARB",
  "FREE",
  "HEALTH",
  "MENTAL_HEALTH",
] as const;

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
    const withoutExisting = allFood.filter(
      (f) => !existingIds.includes(f.id)
    );

    if (!category) return withoutExisting;

    return withoutExisting.filter((f) => f.category === category);
  }, [allFood, category, existingIds]);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              בחירת מוצר מזון
            </Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#ef4444" />
            </Pressable>
          </View>

          {/* Search */}
          <TextInput
            placeholder="חיפוש מוצר..."
            value={search}
            onChangeText={setSearch}
            style={styles.input}
          />

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.row}
          >
            <Pressable
              onPress={() => setCategory(null)}
              style={[
                styles.button,
                category === null ? styles.buttonActive : styles.buttonInactive,
              ]}
            >
              <Text
                style={[
                  styles.text,
                  category === null ? styles.textActive : styles.textInactive,
                ]}
              >
                הכל
              </Text>
            </Pressable>

            {categories.map((cat) => (
              <Pressable
                key={cat}
                onPress={() => setCategory(cat)}
                style={[
                  styles.button,
                  category === cat ? styles.buttonActive : styles.buttonInactive,
                ]}
              >
                <Text
                  style={[
                    styles.text,
                    category === cat ? styles.textActive : styles.textInactive,
                  ]}
                >
                  {cat}
                </Text>
              </Pressable>
            ))}
          </ScrollView>

          {/* List */}
          <ScrollView>
            {isLoading && (
              <Text style={styles.message}>
                טוען מוצרים...
              </Text>
            )}

            {!isLoading && filteredFood.length === 0 && (
              <Text style={styles.message}>
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
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              />
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}