import { View, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { styles } from "./styles/ChatInput.styles";

export default function ChatInput() {
  const [text, setText] = useState("");

  return (
    <View style={styles.container}>
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="הקלד הודעה..."
        style={styles.input}
      />

      <Pressable style={styles.sendButton}>
        <Ionicons name="send" size={20} color="#fff" />
      </Pressable>
    </View>
  );
}