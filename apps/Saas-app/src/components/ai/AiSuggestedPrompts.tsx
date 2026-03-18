import { View, Text, Pressable } from "react-native";
import { styles } from "./styles/AiSuggestedPrompts.styles";

export default function AiSuggestedPrompts({ onChoose }) {
  const prompts = [
    "סקירת לקוח",
    "התקדמות שבועית",
    "סקירת תזונה",
    "סקירת אימונים",
    "רשימת לקוחות",
    "שליחת הודעה",
    "סימון הודעה כטופלה",
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
