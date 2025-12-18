import { View, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { styles } from "./styles/AiInput.styles";

export default function AiInput({ onSend }) {
  const [text, setText] = useState("");

  function submit() {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.button}>
        <Ionicons name="attach" size={22} color="#6b7280" />
      </Pressable>

      <View style={styles.row}>
        <TextInput
          multiline
          value={text}
          onChangeText={setText}
          placeholder="שאל אותי כל דבר..."
          style={styles.input}
        />
      </View>

      <Pressable onPress={submit} style={styles.sendButton}>
        <Ionicons name="send" size={20} color="#fff" />
      </Pressable>
    </View>
  );
}