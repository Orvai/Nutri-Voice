import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import SupplementPickerModal from "./SupplementPickerModal";
import SupplementCreateModal from "./SupplementCreateModal";
import { Vitamin } from "../../../../hooks/nutrition-plan/useTemplateMenuPlan";
import { GlobalSupplement } from "../../../../hooks/nutrition-plan/useSupplementsStore";

interface Props {
  vitamins: Vitamin[];

  // Template actions (draft)
  onAddToTemplate: (id: string) => void;
  onRemoveFromTemplate: (id: string) => void;
  onUpdateInTemplate: (id: string, fields: Partial<Vitamin>) => void;

  // Global supplements
  allSupplements: GlobalSupplement[];
  onCreateNewSupplement: (data: { name: string; description?: string }) => GlobalSupplement;
}

export default function SupplementsList({
  vitamins,
  onAddToTemplate,
  onRemoveFromTemplate,
  onUpdateInTemplate,
  allSupplements,
  onCreateNewSupplement,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <View
      style={{
        backgroundColor: "#ecfdf5",
        borderColor: "#a7f3d0",
        borderWidth: 1,
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
      }}
    >
      {/* Header */}
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 6 }}>
          <Ionicons name="medical-outline" size={18} color="#0f766e" />
          <Text style={{ fontWeight: "700", color: "#0f766e" }}>ויטמינים ותוספים</Text>
        </View>

        {/* Add button → opens picker */}
        <Pressable
          onPress={() => setPickerOpen(true)}
          style={{
            flexDirection: "row-reverse",
            gap: 6,
            backgroundColor: "#cffafe",
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 8,
          }}
        >
          <Ionicons name="add" size={16} color="#0f766e" />
          <Text style={{ color: "#0f766e", fontSize: 12, fontWeight: "600" }}>
            הוסף תוסף
          </Text>
        </Pressable>
      </View>

      {/* List of vitamins already inside template */}
      {vitamins.map((v) => (
        <View
          key={v.id}
          style={{
            flexDirection: "row-reverse",
            backgroundColor: "white",
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#99f6e4",
            marginBottom: 10,
            alignItems: "center",
            gap: 10,
          }}
        >
          <View
            style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "#14b8a6" }}
          />

          <Text style={{ flex: 1 }}>{v.name}</Text>

          <TextInput
            value={v.description || ""}
            placeholder="תיאור"
            onChangeText={(t) => onUpdateInTemplate(v.id, { description: t })}
            style={{
              flex: 1,
              backgroundColor: "#f9fafb",
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "#d1d5db",
              textAlign: "right",
              paddingVertical: 4,
              paddingHorizontal: 8,
              fontSize: 12,
            }}
          />

          <Pressable onPress={() => onRemoveFromTemplate(v.id)}>
            <Ionicons name="close" size={20} color="#dc2626" />
          </Pressable>
        </View>
      ))}

      {/* Picker Modal */}
      <SupplementPickerModal
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        allSupplements={allSupplements}
        existingIds={vitamins.map((v) => v.id)}
        onSelect={(id) => {
          onAddToTemplate(id);
          setPickerOpen(false);
        }}
        onCreateNew={() => {
          setPickerOpen(false);
          setCreateOpen(true);
        }}
      />

      {/* Create Modal */}
      <SupplementCreateModal
        visible={createOpen}
        onClose={() => setCreateOpen(false)}
        onSubmit={(data) => {
          const created = onCreateNewSupplement(data);
          onAddToTemplate(created.id);
          setCreateOpen(false);
        }}
      />
    </View>
  );
}
