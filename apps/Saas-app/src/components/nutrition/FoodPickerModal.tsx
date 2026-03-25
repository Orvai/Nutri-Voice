import React, { useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { useCreateFood, useFood } from "@/hooks/nutrition/useFood";
import { Food } from "@/types/ui/nutrition/food.ui";
import PickerItemCard from "../shared/PickerItemCard";
import { styles } from "./styles/FoodPickerModal.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
  existingIds: string[];
  onSelect: (food: Food) => void;
};

function normalizeFilterValue(value?: string | null) {
  return value?.trim().toLowerCase() ?? "";
}

function toErrorMessage(error: unknown) {
  const maybeError = error as {
    response?: {
      data?: {
        error?: { message?: string };
        message?: string;
      };
    };
    message?: string;
  };

  return (
    maybeError?.response?.data?.error?.message ||
    maybeError?.response?.data?.message ||
    maybeError?.message ||
    "לא הצלחנו להוסיף מוצר. נסה שוב."
  );
}

export default function FoodPickerModal({
  visible,
  onClose,
  existingIds,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [newFoodName, setNewFoodName] = useState("");
  const [newFoodCategory, setNewFoodCategory] = useState("");
  const [newFoodCalories, setNewFoodCalories] = useState("");
  const [newFoodDescription, setNewFoodDescription] = useState("");

  const { data: allFood = [], isLoading } = useFood(search);
  const createFood = useCreateFood();

  const categories = useMemo(() => {
    const uniq = new Set<string>();

    for (const item of allFood) {
      const value = item.category?.trim();
      if (value) uniq.add(value);
    }

    return Array.from(uniq).sort((a, b) => a.localeCompare(b, "he"));
  }, [allFood]);

  const searchTrimmed = search.trim();
  const exactSearchNameExists = useMemo(
    () =>
      !!searchTrimmed &&
      allFood.some(
        (food) =>
          normalizeFilterValue(food.name) === normalizeFilterValue(searchTrimmed)
      ),
    [allFood, searchTrimmed]
  );

  const newNameAlreadyExists = useMemo(
    () =>
      !!newFoodName.trim() &&
      allFood.some(
        (food) =>
          normalizeFilterValue(food.name) === normalizeFilterValue(newFoodName)
      ),
    [allFood, newFoodName]
  );

  const filteredFood = useMemo(() => {
    const withoutExisting = allFood.filter(
      (f) => !existingIds.includes(f.id)
    );

    const byCategory = category
      ? withoutExisting.filter(
          (f) =>
            normalizeFilterValue(f.category) ===
            normalizeFilterValue(category)
        )
      : withoutExisting;

    const normalizedSearch = search.trim().toLowerCase();
    if (!normalizedSearch) return byCategory;

    return byCategory.filter((f) => {
      const name = f.name?.toLowerCase() ?? "";
      const description = f.description?.toLowerCase() ?? "";
      const foodCategory = f.category?.toLowerCase() ?? "";

      return (
        name.includes(normalizedSearch) ||
        description.includes(normalizedSearch) ||
        foodCategory.includes(normalizedSearch)
      );
    });
  }, [allFood, category, existingIds, search]);

  const openCreateModal = (prefillName = "") => {
    const defaultCategory = category?.trim() || categories[0] || "";
    setNewFoodName(prefillName.trim());
    setNewFoodCategory(defaultCategory);
    setNewFoodCalories("");
    setNewFoodDescription("");
    setCreateOpen(true);
  };

  const handleCreateFood = async () => {
    const name = newFoodName.trim();
    const categoryValue = newFoodCategory.trim();
    const calories = Number(newFoodCalories.replace(",", "."));
    const descriptionValue = newFoodDescription.trim();

    if (!name) {
      Alert.alert("שגיאה", "יש להזין שם מוצר.");
      return;
    }

    if (newNameAlreadyExists) {
      Alert.alert("שגיאה", "מוצר בשם הזה כבר קיים.");
      return;
    }

    if (!categoryValue) {
      Alert.alert("שגיאה", "יש להזין קטגוריה.");
      return;
    }

    if (Number.isNaN(calories) || calories < 0) {
      Alert.alert("שגיאה", "יש להזין קלוריות תקינות (ל־100 גרם).");
      return;
    }

    try {
      await createFood.mutateAsync({
        name,
        description: descriptionValue ? descriptionValue : null,
        category: categoryValue,
        caloriesPer100g: calories,
      });

      setCreateOpen(false);
      setSearch(name);
      setCategory(categoryValue);
      Alert.alert("נוסף בהצלחה", "המוצר נוסף לספרייה.");
    } catch (error) {
      Alert.alert("שגיאה", toErrorMessage(error));
    }
  };

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

          <Pressable
            onPress={() => openCreateModal(search)}
            style={styles.addNewButton}
          >
            <Text style={styles.addNewButtonText}>
              {searchTrimmed
                ? `+ הוסף "${searchTrimmed}" כמוצר חדש`
                : "+ הוסף מוצר חדש"}
            </Text>
          </Pressable>

          {/* Categories */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.filtersBar}
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
          <ScrollView style={styles.list}>
            {!isLoading && searchTrimmed && !exactSearchNameExists && (
              <Pressable
                onPress={() => openCreateModal(searchTrimmed)}
                style={styles.quickCreateCard}
              >
                <Text style={styles.quickCreateTitle}>
                  לא מצאת? הוסף את "{searchTrimmed}" כמוצר חדש
                </Text>
                <Text style={styles.quickCreateSubtitle}>
                  המאמן יכול להוסיף מוצרים חדשים לספרייה
                </Text>
              </Pressable>
            )}

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

      <Modal visible={createOpen} animationType="fade" transparent>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>הוספת מוצר חדש</Text>
              <Pressable onPress={() => setCreateOpen(false)}>
                <Ionicons name="close" size={24} color="#ef4444" />
              </Pressable>
            </View>

            <TextInput
              placeholder="שם מוצר"
              value={newFoodName}
              onChangeText={setNewFoodName}
              style={styles.input}
              textAlign="right"
            />

            <TextInput
              placeholder="קטגוריה (לדוגמה: חלבון)"
              value={newFoodCategory}
              onChangeText={setNewFoodCategory}
              style={styles.input}
              textAlign="right"
            />

            <TextInput
              placeholder="קלוריות ל־100 גרם"
              value={newFoodCalories}
              onChangeText={setNewFoodCalories}
              style={styles.input}
              keyboardType="decimal-pad"
              textAlign="right"
            />

            <TextInput
              placeholder="תיאור (אופציונלי)"
              value={newFoodDescription}
              onChangeText={setNewFoodDescription}
              style={styles.input}
              textAlign="right"
            />

            {newNameAlreadyExists ? (
              <Text style={styles.errorText}>מוצר בשם הזה כבר קיים במערכת</Text>
            ) : null}

            <Pressable
              onPress={handleCreateFood}
              style={[
                styles.submitButton,
                (createFood.isPending || newNameAlreadyExists) &&
                  styles.submitButtonDisabled,
              ]}
              disabled={createFood.isPending || newNameAlreadyExists}
            >
              {createFood.isPending ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text style={styles.submitButtonText}>שמור מוצר</Text>
              )}
            </Pressable>
          </View>
        </View>
      </Modal>
    </Modal>
  );
}
