import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useFood } from "../../hooks/nutrition/useFood";

export default function FoodPickerModal({
  visible,
  onClose,
  existingIds,
  onSelect,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const { data: allFood = [], isLoading } = useFood(search);

  if (!visible) return null;

  // Remove foods already inside option
  const filtered = allFood.filter((f) => !existingIds.includes(f.id));

  // Apply category filter if selected
  const categoryFiltered = category
    ? filtered.filter((f) => f.category === category)
    : filtered;

  const categories = [
    "PROTEIN",
    "CARB",
    "FREE",
    "HEALTH",
    "MENTAL_HEALTH",
  ];

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        left: 0,
        bottom: 0,
        backgroundColor: "#00000066",
        padding: 20,
        justifyContent: "center",
      }}
    >
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          padding: 16,
          maxHeight: "85%",
        }}
      >
        {/* Header */}
        <View
          style={{
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <Text style={{ fontWeight: "700", fontSize: 18 }}>
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
          style={{
            borderWidth: 1,
            borderColor: "#d1d5db",
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 6,
            marginBottom: 12,
            textAlign: "right",
          }}
        />

        {/* Category Filter */}
        <ScrollView
          horizontal
          style={{ marginBottom: 12 }}
          contentContainerStyle={{ flexDirection: "row-reverse", gap: 8 }}
        >
          <Pressable
            onPress={() => setCategory(null)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 20,
              backgroundColor: category === null ? "#22d3ee" : "#f1f5f9",
            }}
          >
            <Text>{category === null ? "✓ " : ""}הכל</Text>
          </Pressable>

          {categories.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setCategory(cat)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                backgroundColor:
                  category === cat ? "#22d3ee" : "#f1f5f9",
              }}
            >
              <Text>{category === cat ? "✓ " : ""}{cat}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Food List */}
        <ScrollView
          style={{ borderTopWidth: 1, borderColor: "#e5e7eb", paddingTop: 10 }}
        >
          {isLoading && <Text>טוען מוצרים...</Text>}

          {categoryFiltered.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => onSelect(item)}
              style={{
                paddingVertical: 10,
                borderBottomWidth: 1,
                borderColor: "#f3f4f6",
              }}
            >
              <Text style={{ fontWeight: "700", fontSize: 14 }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 12, color: "#6b7280" }}>
                {item.caloriesPer100g || "-"} קק״ל ל־100 גרם
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}
