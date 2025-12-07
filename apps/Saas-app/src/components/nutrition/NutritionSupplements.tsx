import React, { useState } from "react";
import { View, Text, Pressable, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import VitaminPickerModal from "./VitaminPickerModal";
import { useUpdateTemplateMenu } from "../../hooks/nutrition/useUpdateTemplateMenu";
import { UIVitamin } from "../../types/ui/nutrition-ui";


type Props = {
  vitamins: UIVitamin[];
  templateMenuId: string;
};

export default function NutritionSupplements({ vitamins, templateMenuId }: Props) {
  const [pickerOpen, setPickerOpen] = useState(false);

  const updateMenu = useUpdateTemplateMenu(templateMenuId);

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
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 6 }}>
          <Ionicons name="medical-outline" size={18} color="#0f766e" />
          <Text style={{ fontWeight: "700", color: "#0f766e" }}>
            ויטמינים ותוספים נלווים
          </Text>
        </View>

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

      {/* List */}
      {vitamins.map((v) => (
        <View
          key={v.id}
          style={{
            backgroundColor: "white",
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: "#99f6e4",
            marginBottom: 10,
            gap: 8,
          }}
        >
          <Text style={{ fontWeight: "600" }}>{v.name}</Text>

          <TextInput
            multiline
            value={v.description ?? ""}
            placeholder="Description..."
            style={{
              backgroundColor: "#f9fafb",
              borderRadius: 6,
              borderWidth: 1,
              borderColor: "#d1d5db",
              paddingHorizontal: 8,
              paddingVertical: 6,
              fontSize: 12,
              textAlignVertical: "top",
              minHeight: 40,
            }}
          />
        </View>
      ))}

      <VitaminPickerModal
        visible={pickerOpen}
        onClose={() => setPickerOpen(false)}
        existingIds={vitamins.map((v) => v.vitaminId ?? v.id)}
        onSelect={(vit) => {
          updateMenu.mutate(
            {
              vitaminsToAdd: [
                {
                  vitaminId: vit.id,
                  name: vit.name,
                  description: vit.description ?? null,
                },
              ],
            },
            {
              onSuccess(data) {
                console.log("UPDATED MENU:", data);
              },
            }
          );
          setPickerOpen(false);
        }}
      />
    </View>
  );
}
