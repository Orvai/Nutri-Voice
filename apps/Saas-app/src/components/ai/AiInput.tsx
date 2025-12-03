import { View, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function AiInput({ onSend }) {
  const [text, setText] = useState("");

  function submit() {
    if (!text.trim()) return;
    onSend(text.trim());
    setText("");
  }

  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        flexDirection: "row-reverse",
        gap: 10,
      }}
    >
      <Pressable
        style={{
          padding: 12,
          backgroundColor: "#f3f4f6",
          borderRadius: 12,
        }}
      >
        <Ionicons name="attach" size={22} color="#6b7280" />
      </Pressable>

      <View style={{ flex: 1 }}>
        <TextInput
          multiline
          value={text}
          onChangeText={setText}
          placeholder="שאל אותי כל דבר..."
          style={{
            backgroundColor: "#f8fafc",
            padding: 12,
            borderRadius: 12,
            textAlign: "right",
          }}
        />
      </View>

      <Pressable
        onPress={submit}
        style={{
          paddingHorizontal: 20,
          backgroundColor: "#2563eb",
          borderRadius: 12,
          justifyContent: "center",
        }}
      >
        <Ionicons name="send" size={20} color="#fff" />
      </Pressable>
    </View>
  );
}
