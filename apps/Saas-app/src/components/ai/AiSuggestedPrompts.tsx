import { View, Text, Pressable } from "react-native";

export default function AiSuggestedPrompts({ onChoose }) {
  const prompts = [
    "צור תפריט לירידה במשקל",
    "מה הלקוחות בסיכון?",
    "סכם דוחות השבוע",
    "תוכנית אימון לבניית שריר",
  ];

  return (
    <View style={{ flexDirection: "row-reverse", flexWrap: "wrap", gap: 10, padding: 12 }}>
      {prompts.map((p, i) => (
        <Pressable
          key={i}
          onPress={() => onChoose(p)}
          style={{
            backgroundColor: "#f1f5f9",
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 20,
          }}
        >
          <Text style={{ fontSize: 13, color: "#374151" }}>{p}</Text>
        </Pressable>
      ))}
    </View>
  );
}
