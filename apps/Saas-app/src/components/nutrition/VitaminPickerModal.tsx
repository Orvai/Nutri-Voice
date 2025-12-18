import React, { useMemo, useState } from "react";
import { Modal, View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import PickerItemCard from "../shared/PickerItemCard";
import { useVitamins } from "@/hooks/nutrition/useVitamins";
import { Vitamin } from "@/types/ui/nutrition/vitamin.ui";
import { styles } from "./styles/VitaminPickerModal.styles";

type Props = {
  visible: boolean;
  onClose: () => void;
  existingIds: string[];
  onSelect: (vitamin: Vitamin) => void;
};

export default function VitaminPickerModal({
  visible,
  onClose,
  existingIds,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");

  const { data: vitamins = [] } = useVitamins();

  const filteredVitamins = useMemo(() => {
    const withoutExisting = vitamins.filter(
      (v) => !existingIds.includes(v.id)
    );

    if (!search) return withoutExisting;

    return withoutExisting.filter((v) =>
      v.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [existingIds, search, vitamins]);

  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View style={styles.container}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>
              בחר תוסף להוספה
            </Text>
            <Pressable onPress={onClose}>
              <Ionicons name="close" size={24} color="#ef4444" />
            </Pressable>
          </View>

          {/* Search */}
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="חיפוש תוסף..."
            style={styles.input}
          />

          {/* List */}
          <ScrollView>
            {filteredVitamins.map((v) => (
              <PickerItemCard
                key={v.id}
                title={v.name}
                subtitle={v.description ?? undefined}
                onPress={() => onSelect(v)}
              />
            ))}

            {filteredVitamins.length === 0 && (
              <Text style={styles.message}>
                לא נמצאו תוספים
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}