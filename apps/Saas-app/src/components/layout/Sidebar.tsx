import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { useLogout } from "@/hooks/auth/useLogout";
import { styles } from "./styles/Sidebar.styles";

const menuItems = [
  { label: "דשבורד",        icon: "grid-outline",        href: "/(dashboard)/dashboard" },
  { label: "לקוחות",         icon: "people-outline",      href: "/(dashboard)/clients" },
  { label: "תוכניות תזונה",  icon: "restaurant-outline",  href: "/(dashboard)/nutrition-plans" },
  { label: "תוכניות אימון",  icon: "barbell-outline",     href: "/(dashboard)/workout-plans" },
  { label: "שיחות",          icon: "chatbubbles-outline", href: "/(dashboard)/chat" },
  { label: "AI-HELP",        icon: "sparkles",            href: "/(dashboard)/ai-help" },
  { label: "הגדרות",         icon: "settings-outline",    href: "/(dashboard)/settings" },
] as const;

type MenuItem = (typeof menuItems)[number];

export default function Sidebar() {
  const pathname = usePathname();
  const { signOut } = useLogout();

  return (
    <View style={styles.container}>
      <View>
        <Text style={styles.title}>
          Nutri-Voice
        </Text>

        <View style={styles.menuContainer}>
          {menuItems.map((item: MenuItem) => {
            const active = pathname.startsWith(item.href);

            return (
              <Link key={item.href} href={item.href as any} asChild>
                <Pressable
                  // StyleSheet.flatten הופך את המערך לאובייקט אחד ומונע קריסה ב-Web
                  style={StyleSheet.flatten([
                    styles.button,
                    active && styles.buttonActive
                  ])}
                >
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={22}
                    color={active ? "#ffffff" : "#374151"}
                    style={styles.icon}
                  />

                  <Text
                    style={StyleSheet.flatten([
                      styles.text,
                      active && styles.textActive
                    ])}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              </Link>
            );
          })}
        </View>
      </View>

      <Pressable
        onPress={signOut}
        style={styles.logoutButton}
      >
        <Ionicons
          name="log-out-outline"
          size={22}
          color="#dc2626"
          style={styles.logoutIcon}
        />
        <Text
          style={styles.logoutText}
        >
          התנתקות
        </Text>
      </Pressable>
    </View>
  );
}