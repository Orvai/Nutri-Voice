import { View, Text, Pressable, Image } from "react-native";

export default function ChatListItem({ item, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flexDirection: "row-reverse",
        alignItems: "center",
        paddingVertical: 12,
        paddingHorizontal: 16,
        backgroundColor: active ? "#e0ebff" : "#fff",
        borderBottomWidth: 1,
        borderBottomColor: "#f1f5f9",
      }}
    >
      <Image
        source={{ uri: item.avatar }}
        style={{ width: 44, height: 44, borderRadius: 22, marginLeft: 12 }}
      />

      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: "600", textAlign: "right" }}>{item.name}</Text>
        <Text
          style={{
            fontSize: 13,
            color: "#6b7280",
            textAlign: "right",
            marginTop: 2,
          }}
        >
          {item.lastMessage}
        </Text>
      </View>

      {/* תג מצב */}
      {item.unread > 0 && (
        <View
          style={{
            minWidth: 24,
            height: 24,
            backgroundColor: "#2563eb",
            borderRadius: 12,
            justifyContent: "center",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 12 }}>
            {item.unread}
          </Text>
        </View>
      )}
    </Pressable>
  );
}
