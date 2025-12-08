import React, { useEffect, useMemo, useState } from "react";
import { Modal, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { useMealTemplates } from "../../hooks/nutrition/useMealTemplates";
import { MealTemplate } from "../../types/api/nutrition-types/mealTemplate.types";
import PickerItemCard from "../shared/PickerItemCard";

interface Props {
  visible: boolean;
  onClose: () => void;
  onSelect: (template: MealTemplate) => void;
  existingTemplateIds?: string[];
}

export default function MealTemplatePickerModal({
  visible,
  onClose,
  onSelect,
  existingTemplateIds = [],
}: Props) {
  const { data: templates = [], isLoading } = useMealTemplates();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (visible) {
      setSearch("");
    }
  }, [visible]);

  const filteredTemplates = useMemo(() => {
    const withoutExisting = templates.filter(
      (t) => !existingTemplateIds.includes(t.id)
    );

    if (!search.trim()) return withoutExisting;

    return withoutExisting.filter((t) =>
      t.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [existingTemplateIds, search, templates]);

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
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
            borderRadius: 16,
            padding: 16,
            gap: 12,
            maxHeight: "85%",
          }}
        >
          <View
            style={{
              flexDirection: "row-reverse",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: "800" }}>בחר תבנית ארוחה</Text>

            <Pressable onPress={onClose}>
              <Text style={{ color: "#ef4444", fontWeight: "700" }}>סגור</Text>
            </Pressable>
          </View>

          <TextInput
            placeholder="חיפוש תבנית..."
            value={search}
            onChangeText={setSearch}
            style={{
              borderWidth: 1,
              borderColor: "#d1d5db",
              borderRadius: 10,
              paddingHorizontal: 12,
              paddingVertical: 10,
              textAlign: "right",
            }}
          />

          <ScrollView style={{ maxHeight: 400 }}>
            {isLoading && (
              <Text style={{ textAlign: "center", color: "#6b7280", padding: 10 }}>
                טוען תבניות...
              </Text>
            )}

            {!isLoading && filteredTemplates.length === 0 && (
              <Text style={{ textAlign: "center", color: "#6b7280", padding: 10 }}>
                לא נמצאו תבניות
              </Text>
            )}

            {filteredTemplates.map((template) => (
              <PickerItemCard
                key={template.id}
                title={template.name}
                subtitle={template.kind}
                onPress={() => {
                  onSelect(template);
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