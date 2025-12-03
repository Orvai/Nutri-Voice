import { View, TextInput } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import React from "react";

type Props = {
  query: string;
  onChange: (value: string) => void;
};

export default function WorkoutSearchBar({ query, onChange }: Props) {
  return (
    <View
      style={{
        flexDirection: "row-reverse",
        alignItems: "center",
        backgroundColor: "#fff",
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 12,
      }}
    >
      <Ionicons
        name={"search" as keyof typeof Ionicons.glyphMap}
        size={18}
        color="#9ca3af"
        style={{ marginLeft: 8 }}
      />
      <TextInput
        value={query}
        onChangeText={onChange}
        placeholder="חפש תרגיל..."
        style={{
          flex: 1,
          fontSize: 14,
          textAlign: "right",
        }}
      />
    </View>
  );
}
