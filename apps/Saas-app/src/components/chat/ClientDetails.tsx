import { View, Text, Image, Pressable } from "react-native";
import { useRouter } from "expo-router"; 
import { styles } from "./styles/ClientDetails.styles";
import type { ClientExtended } from "@/types/client";
interface Props {client: ClientExtended | null;}
export default function ClientDetails({ client }: Props) {
  const router = useRouter();
  if (!client) return null;
  const avatarSource = client?.profileImageUrl
    ? { uri: client.profileImageUrl }
    : {
        uri: "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg",
      };

  const handleGoToProfile = () => {
    router.push(`/clients/${client.id}`);
  };
  return (
    <View style={styles.container}>
      {/* Profile */}
      <View style={styles.profileRow}>
        <Image source={avatarSource} style={styles.avatar} />
        <View>
          <Text style={styles.name}>{client.name}</Text>
        </View>
      </View>
      {/* Info List */}
      <View style={styles.infoList}>
        {client.email && (
          <Text style={styles.infoText}>דוא״ל: {client.email}</Text>
        )}
        {client.phone && (
          <Text style={styles.infoText}>טלפון: {client.phone}</Text>
        )}
        {client.weight && (
          <Text style={styles.infoText}>משקל: {client.weight} ק״ג</Text>
        )}
        {client.goals && (
          <Text style={styles.infoText}>יעד: {client.goals}</Text>
        )}
      </View>
      <Pressable 
        style={({ pressed }) => [
          styles.button,
          pressed && { opacity: 0.7 } 
        ]} 
        onPress={handleGoToProfile}
      >
        <Text style={styles.buttonText}>צפה בפרופיל מלא</Text>
      </Pressable>
    </View>
  );
}