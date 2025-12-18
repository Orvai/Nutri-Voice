import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles/ProfileHeader.styles";

export default function ProfileHeader({ client }) {
  const avatarSource = client.profileImageUrl
    ? { uri: client.profileImageUrl }
    : {
        uri: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg",
      };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.infoRow}>
          <Image source={avatarSource} style={styles.avatar} />

          <View style={styles.info}>
            <Text style={styles.name}>{client.name || "לא צוין"}</Text>
            <Text style={styles.muted}>{client.phone || "לא צוין"}</Text>
            <Text style={styles.muted}>{client.ageGender || "לא צוין"}</Text>
            <Text style={styles.muted}>{client.location || "לא צוין"}</Text>
          </View>
        </View>

        <Pressable style={styles.action}>
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
