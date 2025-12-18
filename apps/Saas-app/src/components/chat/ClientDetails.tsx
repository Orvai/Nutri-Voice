import { View, Text, Image } from "react-native";
import { styles } from "./styles/ClientDetails.styles";

export default function ClientDetails({ conversation }) {
  if (!conversation) return null;

  return (
    <View style={styles.container}>
      <View style={styles.profileRow}>
        <Image source={{ uri: conversation.avatar }} style={styles.avatar} />
        <View>
          <Text style={styles.name}>
            {conversation.name}
          </Text>
          <Text style={styles.status}>
            לקוח פעיל
          </Text>
        </View>
      </View>

      <View style={styles.infoList}>
        <Text style={styles.infoText}>דוא״ל: example@gmail.com</Text>
        <Text style={styles.infoText}>טלפון: 050-1234567</Text>
        <Text style={styles.infoText}>משקל: 78 ק״ג</Text>
        <Text style={styles.infoText}>יעד: ירידה במשקל</Text>
      </View>

      <View style={styles.button}>
        <Text style={styles.buttonText}>
          צפה בפרופיל מלא
        </Text>
      </View>
    </View>
  );
}
