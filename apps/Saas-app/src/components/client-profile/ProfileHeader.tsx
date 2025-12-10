import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { ClientExtended } from "../../types/client";

type ProfileHeaderProps = {
  client: ClientExtended;
};

export default function ProfileHeader({ client }: ProfileHeaderProps) {
  const avatarSource =
    client.profileImageUrl
      ? { uri: client.profileImageUrl }
      : {
          uri: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg",
        };

  const genderLabel =
    client.gender === "male"
      ? "זכר"
      : client.gender === "female"
        ? "נקבה"
        : null;

  const ageGenderText = [
    client.age != null ? `גיל ${client.age}` : null,
    genderLabel,
  ]
    .filter(Boolean)
    .join(" • ");

  const locationText = [
    client.city ?? null,
    client.height != null ? `${client.height} ס״מ` : null,
  ]
    .filter(Boolean)
    .join(" • ");

  const displayName = client.name || "לא צוין";
  const displayPhone = client.phone || "לא צוין";
  const displayAgeGender = ageGenderText || "לא צוין";
  const displayLocation = locationText || "לא צוין";

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
        <Image source={avatarSource} style={{ width: 60, height: 60, borderRadius: 40 }} />

        <View style={{ alignItems: "flex-end" }}>
          <Text style={{ fontSize: 22, fontWeight: "700" }}>
            {displayName}
          </Text>

          <Text style={{ color: "#6b7280", fontSize: 14 }}>
            {displayPhone}
          </Text>

          <Text style={{ color: "#6b7280", fontSize: 14 }}>{displayAgeGender}</Text>

          <Text style={{ color: "#6b7280", fontSize: 14 }}>{displayLocation}</Text>
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
