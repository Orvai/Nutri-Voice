import { useState } from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MealOptionsBlock from "./MealOptionsBlock";
import { Meal } from "../../../../types/nutrition";

interface MealBlockProps {
  meal: Meal;

  onRemove: () => void;                            // TODO: connect later
  onUpdateName: (name: string) => void;            // TODO
  onSelectOption: (optionId: string | null) => void; // TODO
}

export default function MealBlock({
  meal,
  onRemove,
  onUpdateName,
  onSelectOption,
}: MealBlockProps) {
  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(meal.name);

  const selectedOptionId = meal.selectedOptionId;

  const commitNameChange = () => {
    onUpdateName(nameValue.trim());
    setEditingName(false);
  };

  return (
    <View
      style={{
        backgroundColor: "white",
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        padding: 12,
      }}
    >
      {/* --- Header Row --- */}
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 10,
        }}
      >
        {/* Meal Name (editable) */}
        <View style={{ flex: 1, marginLeft: 12 }}>
          {editingName ? (
            <TextInput
              value={nameValue}
              onChangeText={setNameValue}
              onBlur={commitNameChange}
              autoFocus
              style={{
                padding: 6,
                borderWidth: 1,
                borderColor: "#d1d5db",
                borderRadius: 6,
                textAlign: "right",
              }}
            />
          ) : (
            <Pressable onLongPress={() => setEditingName(true)}>
              <Text style={{ fontSize: 16, fontWeight: "600", textAlign: "right" }}>
                {meal.name}
              </Text>
            </Pressable>
          )}
        </View>

        {/* Delete meal */}
        <Pressable onPress={onRemove} hitSlop={10}>
          <Ionicons name="trash-outline" size={20} color="#dc2626" />
        </Pressable>
      </View>

      {/* --- Options --- */}
      <MealOptionsBlock
        options={meal.options}
        selectedOptionId={selectedOptionId}
        onSelectOption={onSelectOption} // TODO: hook later
      />
    </View>
  );
}
