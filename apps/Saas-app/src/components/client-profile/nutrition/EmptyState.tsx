import { View, Text, Pressable } from "react-native";

export default function EmptyState({ onCreate }) {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "600", marginBottom: 16 }}>
        ללקוח אין תכנית תזונה
      </Text>

      <Pressable
        onPress={onCreate}
        style={{
          backgroundColor: "#0ea5e9",
          paddingVertical: 12,
          borderRadius: 10,
        }}
      >
        <Text
          style={{
            color: "white",
            textAlign: "center",
            fontSize: 16,
            fontWeight: "700",
          }}
        >
          + צור תכנית תזונה חדשה
        </Text>
      </Pressable>
    </View>
  );
}
