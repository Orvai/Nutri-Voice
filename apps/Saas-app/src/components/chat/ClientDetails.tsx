import { View, Text, Image } from "react-native";
import { styles } from "./styles/ClientDetails.styles";

import type { ClientExtended } from "@/types/client";

interface Props {
  client: ClientExtended | null;
}


export default function ClientDetails({ client }: Props) {
  if (!client) return null;

  const avatarSource = client?.profileImageUrl
  ? { uri: client.profileImageUrl }
  : {
      uri:
        "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-default.jpg",
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

      {/* Info */}
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

      {/* Action */}
      <View style={styles.button}>
        <Text style={styles.buttonText}>צפה בפרופיל מלא</Text>
      </View>
    </View>
  );
}
