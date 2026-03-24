import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { colors } from "@/constants/colors";
import { useAuthSession } from "@/hooks/auth/useAuthSession";
import { Screen } from "@/components/ui/Screen";
import { StatusView } from "@/components/ui/StatusView";

const iconMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  home: "home-outline",
  nutrition: "restaurant-outline",
  workout: "barbell-outline",
  community: "people-outline",
  assistant: "sparkles-outline",
  settings: "settings-outline"
};

const labelMap: Record<string, string> = {
  home: "בית",
  nutrition: "תזונה",
  workout: "אימון",
  community: "קהילה",
  assistant: "עוזר",
  settings: "הגדרות"
};

export default function TabsLayout() {
  const { user, isHydrated } = useAuthSession();

  if (!isHydrated) {
    return (
      <Screen scroll={false} contentContainerStyle={{ flex: 1, justifyContent: "center" }}>
        <StatusView type="loading" title="טוען..." />
      </Screen>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.border,
          height: 72,
          paddingTop: 6,
          paddingBottom: 10
        },
        tabBarActiveTintColor: colors.neon,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600"
        },
        tabBarIcon: ({ focused, color }) => {
          const iconName = iconMap[route.name] ?? "ellipse-outline";

          if (route.name === "workout") {
            return (
              <Ionicons
                name={iconName}
                color={focused ? colors.black : color}
                size={18}
                style={
                  focused
                    ? {
                        backgroundColor: colors.neon,
                        padding: 10,
                        borderRadius: 999
                      }
                    : undefined
                }
              />
            );
          }

          return <Ionicons name={iconName} color={color} size={20} />;
        },
        tabBarLabel: labelMap[route.name] ?? route.name
      })}
    >
      <Tabs.Screen name="home" />
      <Tabs.Screen name="nutrition" />
      <Tabs.Screen name="workout" />
      <Tabs.Screen name="community" />
      <Tabs.Screen name="assistant" />
      <Tabs.Screen name="settings" />
    </Tabs>
  );
}
