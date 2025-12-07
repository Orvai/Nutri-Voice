import React from "react";
import { Pressable, Text, View } from "react-native";

export type PickerItemCardProps = {
  title: string;
  subtitle?: string;
  onPress: () => void;
  selected?: boolean;
};

export default function PickerItemCard({
  title,
  subtitle,
  onPress,
  selected = false,
}: PickerItemCardProps) {
  return (
    <View
      style={{
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: selected ? "#2563eb" : "#e5e7eb",
        borderRadius: 12,
        padding: 12,
        marginBottom: 10,
        flexDirection: "row-reverse",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <View style={{ flex: 1, gap: 4 }}>
        <Text style={{ fontWeight: "700", textAlign: "right" }}>{title}</Text>
        {subtitle ? (
          <Text style={{ color: "#6b7280", fontSize: 12, textAlign: "right" }}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      <Pressable
        onPress={onPress}
        style={{
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 10,
          backgroundColor: "#2563eb",
        }}
      >
        <Text style={{ color: "white", fontWeight: "700", fontSize: 12 }}>בחר</Text>
      </Pressable>
    </View>
  );
}