import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";

type AppHeaderProps = {
  subtitle: string;
  title: string;
  avatarUrl?: string | null;
  onNotificationsPress?: () => void;
};

export function AppHeader({
  subtitle,
  title,
  avatarUrl,
  onNotificationsPress
}: AppHeaderProps) {
  return (
    <View style={styles.container}>
      <Pressable style={styles.notification} onPress={onNotificationsPress}>
        <Ionicons name="notifications-outline" size={20} color={colors.textSecondary} />
        <View style={styles.dot} />
      </Pressable>

      <View style={styles.identity}>
        <View>
          <Text style={styles.subtitle}>{subtitle}</Text>
          <Text style={styles.title}>{title}</Text>
        </View>
        <Image
          style={styles.avatar}
          source={{
            uri:
              avatarUrl ??
              "https://storage.googleapis.com/uxpilot-auth.appspot.com/c2fcca9002-74f58ee8808b4f15b2b0.png"
          }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  identity: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm
  },
  subtitle: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: "right",
    marginBottom: 2
  },
  title: {
    color: colors.white,
    fontSize: 22,
    fontWeight: "700",
    textAlign: "right"
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.neon
  },
  notification: {
    width: 40,
    height: 40,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.surface
  },
  dot: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.danger,
    top: 8,
    left: 8
  }
});
