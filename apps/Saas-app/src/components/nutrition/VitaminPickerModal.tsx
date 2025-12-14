import React, { useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  TextInput,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import PickerItemCard from "../shared/PickerItemCard";
import { useVitamins } from "@/hooks/nutrition/useVitamins";
import { Vitamin } from "@/types/ui/nutrition/vitamin.ui";

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
            maxHeight: "80%",
            gap: 12,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontWeight: "800", fontSize: 18 }}>
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
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 10,
              textAlign: "right",
            }}
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
              <Text
                style={{
                  textAlign: "center",
                  color: "#6b7280",
                  padding: 10,
                }}
              >
                לא נמצאו תוספים
              </Text>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
