import { View, Text, Image, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
// 1. ייבוא ה-Hook
import { useNavigation } from "@react-navigation/native"; 
import { styles } from "./styles/ProfileHeader.styles";

export default function ProfileHeader({ client }) {
  // 2. אתחול הניווט
  const navigation = useNavigation();

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

  // 3. פונקציית המעבר למסך השיחה
  const handleChatPress = () => {
    // אנו עוברים למסך בשם 'Chat' (ודא שזה השם שהגדרת ב-Stack Navigator)
    // ומעבירים את פרטי הלקוח כפרמטרים
    navigation.navigate("Chat", { 
      clientId: client.id, 
      clientName: client.name 
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

        {/* 4. הוספת אירוע הלחיצה */}
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