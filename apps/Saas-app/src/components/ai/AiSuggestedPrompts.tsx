import { View, Text, Pressable } from "react-native";
import { styles } from "./styles/AiSuggestedPrompts.styles";

export default function AiSuggestedPrompts({ onChoose }) {
  const prompts = [
    "צור תפריט לירידה במשקל",
    "מה הלקוחות בסיכון?",
    "סכם דוחות השבוע",
    "תוכנית אימון לבניית שריר",
  ];

  return (
    <View style={styles.container}>
      {prompts.map((p, i) => (
        <Pressable
          key={i}
          onPress={() => onChoose(p)}
          style={styles.button}
        >
          <Text style={styles.text}>{p}</Text>
        </Pressable>
      ))}
    </View>
  );
}