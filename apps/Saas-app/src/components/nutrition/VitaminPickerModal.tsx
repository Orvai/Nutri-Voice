import React, { useState } from "react";
import { Modal, View, Text, Pressable, TextInput, ScrollView } from "react-native";
import { useVitamins } from "../../hooks/nutrition/useVitamins";

type Props = {
  visible: boolean;
  onClose: () => void;
  existingIds: string[];
  onSelect: (vitamin: any) => void;
};

export default function VitaminPickerModal({
  visible,
  onClose,
  existingIds,
  onSelect,
}: Props) {
  const [search, setSearch] = useState("");

  const { data: vitamins } = useVitamins();

  if (!visible) return null;

  const filtered = (vitamins || [])
    .filter((v) => !existingIds.includes(v.id))
    .filter((v) => v.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "white",
            padding: 16,
            borderRadius: 12,
            maxHeight: "70%",
          }}
        >
          <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 12, textAlign: "center" }}>
            בחר תוסף להוספה
          </Text>

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="חיפוש תוסף..."
            style={{
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              padding: 8,
              marginBottom: 12,
            }}
          />

          <ScrollView style={{ marginBottom: 12 }}>
            {filtered.map((v) => (
              <Pressable
                key={v.id}
                onPress={() => onSelect(v)}
                style={{
                  padding: 10,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                }}
              >
                <Text style={{ fontSize: 14 }}>{v.name}</Text>
                {v.description && <Text style={{ fontSize: 12, color: "#6b7280" }}>{v.description}</Text>}
              </Pressable>
            ))}

            {filtered.length === 0 && (
              <Text style={{ textAlign: "center", color: "#6b7280", padding: 10 }}>
                לא נמצאו תוספים
              </Text>
            )}
          </ScrollView>

          <Pressable
            onPress={onClose}
            style={{
              backgroundColor: "#2563eb",
              paddingVertical: 10,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "700", textAlign: "center" }}>סגור</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
