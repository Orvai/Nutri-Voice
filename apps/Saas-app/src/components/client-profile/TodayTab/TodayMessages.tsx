import { View, Text, Image, Pressable } from "react-native";
import { styles } from "../styles/TodayMessages.styles";

export default function TodayMessages({ messages }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>הודעות</Text>

      {messages.map((m) => (
        <View key={m.id} style={styles.message}>
          <View style={styles.row}>
            <Image source={{ uri: m.avatar }} style={styles.avatar} />
            <View style={{ flex: 1 }}>
              <Text style={styles.text}>{m.text}</Text>
              <Text style={styles.time}>{m.time}</Text>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <Pressable style={styles.actionPrimary}>
              <Text style={styles.actionPrimaryText}>השב</Text>
            </Pressable>

            <Pressable style={styles.actionSecondary}>
              <Text style={styles.actionSecondaryText}>סמן כטופל</Text>
            </Pressable>
          </View>
        </View>
      ))}

      <Pressable style={styles.footer}>
        <Text style={styles.footerText}>צפה בכל ההודעות</Text>
      </Pressable>
    </View>
  );
}
