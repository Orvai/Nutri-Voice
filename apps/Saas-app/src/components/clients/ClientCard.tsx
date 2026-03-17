import { View, Text, Image, Pressable } from "react-native";
import { router } from "expo-router";
import { ClientExtended } from "../../types/client";
import { styles } from "./styles/ClientCard.styles";

type ClientCardProps = {
  client: ClientExtended;
};

export default function ClientCard({ client }: ClientCardProps) {
  const goToProfile = () => {
    router.push({
      pathname: "/(dashboard)/clients/[id]",
      params: { id: client.id },
    });
  };

  const avatarSource =
    client.profileImageUrl
      ? { uri: client.profileImageUrl }
      : {
          uri:
            "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg",
        };

  return (
    <Pressable
      onPress={goToProfile}
      style={({ pressed }) => [
        styles.container,
        {
          borderColor: "#e5e7eb",
          opacity: pressed ? 0.8 : 1,
          shadowRadius: pressed ? 6 : 4,
          shadowOpacity: pressed ? 0.1 : 0.06,
          elevation: pressed ? 2 : 1,
        },
      ]}
    >
      {/* Avatar */}
      <Image source={avatarSource} style={styles.avatar} />

      {/* Name + Phone */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>
          {client.name || "לא צוין"}
        </Text>

        <Text style={styles.phone}>
          {client.phone || "לא צוין"}
        </Text>
      </View>

      <Text style={styles.viewText}>
        צפה
      </Text>
    </Pressable>
  );
}
