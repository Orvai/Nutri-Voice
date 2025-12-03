import { View, Text, Image } from "react-native";

export default function AiUserBubble({ message }) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "flex-end",
        marginBottom: 24,
        gap: 10,
      }}
    >
      <View style={{ maxWidth: "75%" }}>
        <View
          style={{
            backgroundColor: "#2563eb",
            padding: 14,
            borderRadius: 16,
            borderTopLeftRadius: 0,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 15, lineHeight: 22 }}>
            {message.text}
          </Text>
        </View>

        <Text style={{ fontSize: 11, color: "#6b7280", marginTop: 6, textAlign: "left" }}>
          {message.time}
        </Text>
      </View>

      <Image
        source={{ uri: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg" }}
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
    </View>
  );
}
