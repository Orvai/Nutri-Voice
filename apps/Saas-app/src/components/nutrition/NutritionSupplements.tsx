import React, { useMemo, useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import VitaminPickerModal from "./VitaminPickerModal";
import { styles } from "./styles/NutritionSupplements.styles";

import { useNutritionMenuMutation } from "@/hooks/composition/useNutritionMenuMutation";
import {
  UINutritionSource,
  UIVitamin,
} from "@/types/ui/nutrition/nutrition.types";

type Props = {
  vitamins: UIVitamin[];
  menuId: string;
  source: UINutritionSource;
};

export default function NutritionSupplements({
  vitamins,
  menuId,
  source,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [removedIds, setRemovedIds] = useState<string[]>([]);
  const [removingIds, setRemovingIds] = useState<string[]>([]);

  // Semantic mutation facade
  const menuActions = useNutritionMenuMutation(source);

  const visibleVitamins = useMemo(
    () => vitamins.filter((v) => !removedIds.includes(v.id)),
    [removedIds, vitamins]
  );

  const handleRemoveVitamin = (vitaminRelationId: string) => {
    setRemovingIds((prev) => [...prev, vitaminRelationId]);

    menuActions.removeVitamin(menuId, vitaminRelationId);

    // optimistic UI (local only)
    setRemovedIds((prev) => [...prev, vitaminRelationId]);
    setRemovingIds((prev) =>
      prev.filter((id) => id !== vitaminRelationId)
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.row}>
          <Ionicons name="medical-outline" size={18} color="#0f766e" />
          <Text style={styles.title}>
            ויטמינים ותוספים נלווים
          </Text>
        </View>

        <Pressable
          onPress={() => setPickerOpen(true)}
          style={styles.button}
        >
          <Ionicons name="add" size={16} color="#0f766e" />
          <Text style={styles.buttonText}>
            הוסף תוסף
          </Text>
        </Pressable>
      </View>

      {visibleVitamins.map((v) => (
        <View key={v.id} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>{v.name}</Text>

            <Pressable
              onPress={() => handleRemoveVitamin(v.id)}
              disabled={removingIds.includes(v.id)}
              style={styles.removeButton}
            >
              <Ionicons
                name="close"
                size={16}
                color="#dc2626"
                style={[
                  styles.removeIcon,
                  removingIds.includes(v.id) && styles.removeIconDisabled,
                ]}
              />
            </Pressable>
          </View>

          <TextInput
            multiline
            value={v.description ?? ""}
            placeholder="Description..."
            editable={false}
            style={styles.input}
          />
        </View>
      ))}

      <VitaminPickerModal
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        existingIds={vitamins.map((v) => v.id)}
        onSelect={(vit) => {
          menuActions.addVitamin(menuId, {
            vitaminId: vit.id,
            name: vit.name,
            description: vit.description ?? null,
          });

          setPickerOpen(false);
        }}
      />
    </View>
  );
}