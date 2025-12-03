import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ProfileHeader({ client }) {
  return (
    <View
      style={{
        backgroundColor: "#fff",
        padding: 20,
        borderBottomWidth: 1,
        borderColor: "#e5e7eb",
      }}
    >
      <View
        style={{
          flexDirection: "row-reverse",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {/* RIGHT — Picture + Personal Details */}
        <View style={{ flexDirection: "row-reverse", alignItems: "center", gap: 12 }}>
          <Image
            source={{ uri: client.avatar }}
            style={{ width: 60, height: 60, borderRadius: 40 }}
          />

          <View style={{ alignItems: "flex-end" }}>
            <Text style={{ fontSize: 22, fontWeight: "700" }}>
              {client.name}
            </Text>

            <Text style={{ color: "#6b7280", fontSize: 14 }}>
              {client.phone}
            </Text>

            <Text style={{ color: "#6b7280", fontSize: 14 }}>
              גיל {client.info?.age} • {client.info?.gender === "male" ? "זכר" : "נקבה"}
            </Text>

            <Text style={{ color: "#6b7280", fontSize: 14 }}>
              {client.info?.city} • {client.info?.height} ס״מ
            </Text>
          </View>
        </View>

        {/* LEFT — Actions */}
        <View style={{ flexDirection: "row-reverse" }}>
          <Pressable
            style={{
              paddingHorizontal: 14,
              paddingVertical: 10,
              backgroundColor: "#2563eb",
              borderRadius: 8,
              flexDirection: "row-reverse",
              alignItems: "center",
            }}
          >
            <Ionicons
              name="chatbubble-ellipses"
              size={18}
              color="#fff"
              style={{ marginLeft: 6 }}
            />
            <Text style={{ fontSize: 14, color: "#fff" }}>שלח הודעה</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
