import { View, Text, TextInput } from "react-native";
import { useEffect, useState } from "react";

import { useNutritionMenuMutation } from "@/hooks/composition/useNutritionMenuMutation";
import { UINutritionSource } from "@/types/ui/nutrition/nutrition.types";

type Props = {
  notes: string | null;
  menuId: string;
  source: UINutritionSource;
};

export default function NutritionNotes({ notes, menuId, source }: Props) {
  const [localNotes, setLocalNotes] = useState(notes ?? "");

  //  UI-facing semantic mutation API
  const menuActions = useNutritionMenuMutation(source);

  useEffect(() => {
    setLocalNotes(notes ?? "");
  }, [notes]);

  const handleBlur = () => {
    menuActions.updateNotes(menuId, localNotes || null);
  };

  return (
    <View
      style={{
        backgroundColor: "#fef3c7",
        borderColor: "#fcd34d",
        borderWidth: 1,
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: "600", marginBottom: 8 }}>
        הערות כלליות
      </Text>

      <TextInput
        multiline
        placeholder="הוסף הערות..."
        value={localNotes}
        onChangeText={setLocalNotes}
        onBlur={handleBlur}
        style={{
          backgroundColor: "white",
          borderRadius: 8,
          borderWidth: 1,
          borderColor: "#fde68a",
          padding: 8,
          textAlignVertical: "top",
          minHeight: 60,
          textAlign: "right",
        }}
      />
    </View>
  );
}
