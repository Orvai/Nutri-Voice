import { View, Text, TextInput } from "react-native";

export default function NutritionNotes({ notes }) {
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
        defaultValue={notes}
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
