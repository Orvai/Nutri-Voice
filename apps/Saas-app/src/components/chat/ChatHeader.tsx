import { View, Text, Image } from "react-native";

export default function ChatHeader({ conversation }) {
  if (!conversation) return null;

  return (
    <View
      style={{
        height: 70,
        backgroundColor: "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        flexDirection: "row-reverse",
        alignItems: "center",
        paddingHorizontal: 20,
        justifyContent: "space-between",
      }}
    >
      <View style={{ flexDirection: "row-reverse", alignItems: "center" }}>
        <Image
          source={{ uri: conversation.avatar }}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            marginLeft: 12,
          }}
        />
        <View>
          <Text style={{ fontSize: 18, fontWeight: "700" }}>{conversation.name}</Text>
          <Text style={{ fontSize: 12, color: "#16a34a" }}>
            ● מחובר עכשיו
          </Text>
        </View>
      </View>
    </View>
  );
}
