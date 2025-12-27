import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; 
import { styles } from "./styles/ProfileHeader.styles";

export default function ProfileHeader({ client }) {
  const router = useRouter();
  const avatarSource = client.profileImageUrl
    ? { uri: client.profileImageUrl }
    : {
        uri: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg",
      };

  const ageGender =
    client.age && client.gender
      ? `${client.age}, ${client.gender}`
      : "לא צוין";

  const location = client.city || client.address || "לא צוין";

  const handleChatPress = () => {
    router.push({
      pathname: "/chat",
      params: { 
        clientId: client.id,
      },
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.infoRow}>
          <Image source={avatarSource} style={styles.avatar} />

          <View style={styles.info}>
            <Text style={styles.name}>{client.name || "לא צוין"}</Text>
            <Text style={styles.muted}>{client.phone || "לא צוין"}</Text>
            <Text style={styles.muted}>{ageGender}</Text>
            <Text style={styles.muted}>{location}</Text>
          </View>
        </View>

        <Pressable style={styles.action} onPress={handleChatPress}>
          <Ionicons
            name="chatbubble-ellipses"
            size={18}
            color="#fff"
            style={styles.actionIcon}
          />
          <Text style={styles.actionText}>שלח הודעה</Text>
        </Pressable>
      </View>
    </View>
  );
}