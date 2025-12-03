import { View, Text, Image, Pressable } from "react-native";

export default function TodayMessages({ messages }) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: "#e5e7eb",
        marginBottom: 16,
      }}
    >
      <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
        הודעות
      </Text>

      {messages.map((m) => (
        <View
          key={m.id}
          style={{
            paddingBottom: 10,
            marginBottom: 12,
            borderBottomWidth: 1,
            borderColor: "#f3f4f6",
          }}
        >
          <View style={{ flexDirection: "row-reverse", gap: 10, marginBottom: 6 }}>
            <Image
              source={{ uri: m.avatar }}
              style={{ width: 40, height: 40, borderRadius: 30 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14 }}>{m.text}</Text>
              <Text style={{ fontSize: 12, color: "#6b7280" }}>{m.time}</Text>
            </View>
          </View>

          <View style={{ flexDirection: "row-reverse", gap: 8 }}>
            <Pressable
              style={{
                backgroundColor: "#eff6ff",
                padding: 8,
                borderRadius: 8,
                flex: 1,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#2563eb", fontSize: 12 }}>השב</Text>
            </Pressable>

            <Pressable
              style={{
                backgroundColor: "#f3f4f6",
                padding: 8,
                borderRadius: 8,
                flex: 1,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#374151", fontSize: 12 }}>
                סמן כטופל
              </Text>
            </Pressable>
          </View>
        </View>
      ))}

      <Pressable style={{ marginTop: 10, alignItems: "center" }}>
        <Text style={{ color: "#2563eb", fontWeight: "600" }}>
          צפה בכל ההודעות
        </Text>
      </Pressable>
    </View>
  );
}
