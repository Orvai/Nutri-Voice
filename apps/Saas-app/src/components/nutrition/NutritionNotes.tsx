import { View, Text, TextInput } from "react-native";
import { useEffect, useState } from "react";
import { useNutritionMenuMutation } from "@/hooks/composition/useNutritionMenuMutation";
import { UINutritionSource } from "@/types/ui/nutrition/nutrition.types";
import { styles } from "./styles/NutritionNotes.styles";

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
    <View style={styles.container}>
      <Text style={styles.title}>
        הערות כלליות
      </Text>

      <TextInput
        multiline
        placeholder="הוסף הערות..."
        value={localNotes}
        onChangeText={setLocalNotes}
        onBlur={handleBlur}
        style={styles.input}
      />
    </View>
  );
}