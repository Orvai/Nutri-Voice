import { View, Text, Image, Pressable } from "react-native";
import { router } from "expo-router";
import { useUserInfo } from "../../../src/hooks/useUserInfo";

export default function ClientCard({ client }) {
  const { data: info } = useUserInfo(client.userId);

  const goToProfile = () => {
    router.push({
      pathname: "/(dashboard)/clients/[id]",
      params: { id: client.id },
    });
  };

  return (
    <Pressable
      onPress={goToProfile}
      style={({ hovered, pressed }) => ({
        backgroundColor: "#ffffff",
        borderRadius: 16,
        padding: 18,
        marginBottom: 14,
        flexDirection: "row-reverse",
        alignItems: "center",
        gap: 16,
        borderWidth: 1,
        borderColor: hovered ? "#d1d5db" : "#e5e7eb",
        opacity: pressed ? 0.8 : 1,
        shadowColor: "#000",
        shadowRadius: hovered ? 8 : 4,
        shadowOpacity: hovered ? 0.12 : 0.06,
        elevation: hovered ? 3 : 1,
      })}
    >
      {/* Avatar */}
      <Image
        source={
          info?.profileImageUrl
            ? { uri: info.profileImageUrl }
            : {
                uri:
                  "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg",
              }
        }
        style={{ width: 62, height: 62, borderRadius: 50 }}
      />

      {/* Name + Phone */}
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 17,
            fontWeight: "700",
            color: "#111827",
            textAlign: "right",
          }}
        >
          {client.name}
        </Text>

        <Text
          style={{
            fontSize: 13,
            color: "#6b7280",
            marginTop: 4,
            textAlign: "right",
          }}
        >
          {client.phone}
        </Text>
      </View>

      <Text style={{ fontSize: 13, fontWeight: "600", color: "#2563eb" }}>
        צפה
      </Text>
    </Pressable>
  );
}
