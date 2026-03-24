import { useEffect, useMemo, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { NeonButton } from "@/components/ui/NeonButton";
import { Screen } from "@/components/ui/Screen";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { useLogout } from "@/hooks/auth/useLogout";
import type { AuthRole } from "@/types/auth/auth.ui";

type AppPreferences = {
  pushNotifications: boolean;
  hydrationReminder: boolean;
  quietHours: boolean;
};

const SETTINGS_STORAGE_KEY = "@client-app/settings";

const defaultPreferences: AppPreferences = {
  pushNotifications: true,
  hydrationReminder: true,
  quietHours: false
};

const roleLabelMap: Record<AuthRole, string> = {
  client: "מתאמן",
  trainer: "מאמן",
  admin: "מנהל"
};

const parseBoolean = (value: unknown, fallback: boolean): boolean =>
  typeof value === "boolean" ? value : fallback;

export default function SettingsScreen() {
  const { user } = useAuthSession();
  const { logout } = useLogout();
  const [preferences, setPreferences] = useState<AppPreferences>(defaultPreferences);
  const [isPreferencesHydrated, setIsPreferencesHydrated] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  const roleLabel = useMemo(
    () => (user?.role ? roleLabelMap[user.role] : "משתמש"),
    [user?.role]
  );

  useEffect(() => {
    let isMounted = true;

    const hydratePreferences = async () => {
      try {
        const rawValue = await AsyncStorage.getItem(SETTINGS_STORAGE_KEY);

        if (!rawValue || !isMounted) {
          return;
        }

        const parsed = JSON.parse(rawValue) as Partial<AppPreferences>;

        setPreferences({
          pushNotifications: parseBoolean(
            parsed.pushNotifications,
            defaultPreferences.pushNotifications
          ),
          hydrationReminder: parseBoolean(
            parsed.hydrationReminder,
            defaultPreferences.hydrationReminder
          ),
          quietHours: parseBoolean(parsed.quietHours, defaultPreferences.quietHours)
        });
      } catch (_error) {
      } finally {
        if (isMounted) {
          setIsPreferencesHydrated(true);
        }
      }
    };

    void hydratePreferences();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!isPreferencesHydrated) {
      return;
    }

    void AsyncStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(preferences));
  }, [isPreferencesHydrated, preferences]);

  return (
    <Screen>
      <SectionHeader title="הגדרות" />
      <Text style={styles.subtitle}>ניהול חשבון, העדפות והתראות במקום אחד.</Text>

      <SectionHeader title="פרופיל" />
      <View style={styles.card}>
        <View style={styles.profileRow}>
          <Image
            source={{
              uri:
                user?.avatarUrl ??
                "https://storage.googleapis.com/uxpilot-auth.appspot.com/c2fcca9002-74f58ee8808b4f15b2b0.png"
            }}
            style={styles.avatar}
          />
          <View style={styles.profileText}>
            <Text style={styles.profileName}>{user?.fullName ?? "משתמש"}</Text>
            <Text style={styles.profileRole}>{roleLabel}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>אימייל</Text>
          <Text style={styles.infoValue}>{user?.email ?? "לא זמין"}</Text>
        </View>
      </View>

      <SectionHeader title="העדפות אפליקציה" />
      <View style={styles.card}>
        <PreferenceRow
          title="התראות דחיפה"
          description="עדכונים על ארוחות, אימונים והודעות מהמאמן"
          value={preferences.pushNotifications}
          onValueChange={(value) =>
            setPreferences((prev) => ({ ...prev, pushNotifications: value }))
          }
        />
        <PreferenceRow
          title="תזכורת שתייה"
          description="תזכורת קבועה להשלמת יעד המים היומי"
          value={preferences.hydrationReminder}
          onValueChange={(value) =>
            setPreferences((prev) => ({ ...prev, hydrationReminder: value }))
          }
        />
        <PreferenceRow
          title="שעות שקט"
          description="השתקת התראות בין 23:00 ל-07:00"
          value={preferences.quietHours}
          onValueChange={(value) =>
            setPreferences((prev) => ({ ...prev, quietHours: value }))
          }
        />
      </View>

      <SectionHeader title="קיצורי דרך" />
      <View style={styles.quickActionsRow}>
        <QuickAction
          icon="chatbubbles-outline"
          label="הודעות"
          onPress={() => router.push("/messages")}
        />
        <QuickAction
          icon="sparkles-outline"
          label="עוזר"
          onPress={() => router.push("/(tabs)/assistant")}
        />
        <QuickAction
          icon="restaurant-outline"
          label="דיווח ארוחה"
          onPress={() => router.push("/nutrition/report")}
        />
      </View>

      <SectionHeader title="חשבון" />
      <View style={styles.card}>
        <Text style={styles.accountDescription}>אפשר להתנתק בכל רגע מהמכשיר הנוכחי.</Text>
        <NeonButton
          label="התנתקות"
          variant="danger"
          loading={isLoggingOut}
          onPress={async () => {
            setLogoutError(null);
            setIsLoggingOut(true);

            try {
              await logout();
            } catch (_error) {
              setLogoutError("לא הצלחנו להתנתק כרגע. נסה שוב בעוד רגע.");
            } finally {
              setIsLoggingOut(false);
            }
          }}
        />
        {logoutError ? <Text style={styles.error}>{logoutError}</Text> : null}
      </View>
    </Screen>
  );
}

type PreferenceRowProps = {
  title: string;
  description: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

function PreferenceRow({ title, description, value, onValueChange }: PreferenceRowProps) {
  return (
    <View style={styles.preferenceRow}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.neonSoft }}
        thumbColor={value ? colors.neon : colors.textSecondary}
      />
      <View style={styles.preferenceText}>
        <Text style={styles.preferenceTitle}>{title}</Text>
        <Text style={styles.preferenceDescription}>{description}</Text>
      </View>
    </View>
  );
}

type QuickActionProps = {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
};

function QuickAction({ icon, label, onPress }: QuickActionProps) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.quickAction, pressed && styles.pressed]}>
      <Ionicons name={icon} size={20} color={colors.neon} />
      <Text style={styles.quickActionLabel}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  subtitle: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "right"
  },
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.md
  },
  profileRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    gap: spacing.sm
  },
  profileText: {
    flex: 1,
    gap: spacing.xxs
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: radius.pill,
    borderWidth: 2,
    borderColor: colors.neon
  },
  profileName: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    textAlign: "right"
  },
  profileRole: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "right"
  },
  divider: {
    height: 1,
    backgroundColor: colors.border
  },
  infoRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "right"
  },
  infoValue: {
    color: colors.textPrimary,
    fontSize: 13,
    textAlign: "right"
  },
  preferenceRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md
  },
  preferenceText: {
    flex: 1,
    gap: spacing.xxs
  },
  preferenceTitle: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "right"
  },
  preferenceDescription: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 17,
    textAlign: "right"
  },
  quickActionsRow: {
    flexDirection: "row-reverse",
    gap: spacing.sm
  },
  quickAction: {
    flex: 1,
    minHeight: 84,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xs
  },
  quickActionLabel: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center"
  },
  accountDescription: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "right"
  },
  error: {
    color: colors.danger,
    textAlign: "right",
    fontSize: 13
  },
  pressed: {
    opacity: 0.85
  }
});
