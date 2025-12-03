import { View, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";

export default function ChatInput() {
  const [text, setText] = useState("");

  return (
    <View
      style={{
        height: 70,
        flexDirection: "row-reverse",
        alignItems: "center",
        backgroundColor: "#fff",
        borderTopWidth: 1,
        borderTopColor: "#e5e7eb",
        paddingHorizontal: 16,
        gap: 10,
      }}
    >
      <TextInput
        value={text}
        onChangeText={setText}
        placeholder="הקלד הודעה..."
        style={{
          flex: 1,
          height: 44,
          backgroundColor: "#f1f5f9",
          borderRadius: 12,
          paddingHorizontal: 12,
          textAlign: "right",
        }}
      />

      <Pressable
        style={{
          backgroundColor: "#2563eb",
          width: 44,
          height: 44,
          borderRadius: 22,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name="send" size={20} color="#fff" />
      </Pressable>
    </View>
  );
}
