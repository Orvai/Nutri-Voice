import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Client } from "../../types/client";
import { UserInfo } from "../../types/api/user-types/userInfo.types";

type ProfileHeaderProps = {
  client: Client & { userInfo?: UserInfo | null };
};

export default function ProfileHeader({ client }: ProfileHeaderProps) {
  const info = client.userInfo;

  const avatarSource =
    info?.profileImageUrl
      ? { uri: info.profileImageUrl }
      : {
          uri: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg",
        };

  const genderLabel =
    info?.gender === "male"
      ? "זכר"
      : info?.gender === "female"
        ? "נקבה"
        : null;

  const ageGenderText = [
    info?.age != null ? `גיל ${info.age}` : null,
    genderLabel,
  ]
    .filter(Boolean)
    .join(" • ");

  const locationText = [
    info?.city ?? null,
    info?.height != null ? `${info.height} ס״מ` : null,
  ]
    .filter(Boolean)
    .join(" • ");

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
            {client.name}
          </Text>

          <Text style={{ color: "#6b7280", fontSize: 14 }}>
            {client.phone}
          </Text>

          {ageGenderText ? (
            <Text style={{ color: "#6b7280", fontSize: 14 }}>{ageGenderText}</Text>
          ) : null}

          {locationText ? (
            <Text style={{ color: "#6b7280", fontSize: 14 }}>{locationText}</Text>
          ) : null}
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
