import { View, Text, Pressable } from "react-native";
import { Link, usePathname, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/api"; 

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
  const { setUser } = useAuth();

  async function handleLogout() {
    try {
      await api.post("/api/auth/logout");

    } catch (err: any) {
      console.log("LOGOUT ERROR:", err?.response?.data || err);
    } finally {
      globalThis.ACCESS_TOKEN = undefined;
      setUser(null);

      router.replace("/login");
    }
  }

  return (
    <View
    style={{ width: 240, backgroundColor: "#ffffff", borderLeftWidth: 1, borderLeftColor: "#e5e7eb", paddingTop: 40, }}
    >
      {/* חלק עליון – לוגו + תפריט */}
      <View>
        <Text
          style={{ textAlign: "right", fontSize: 22, fontWeight: "700", paddingHorizontal: 20, marginBottom: 30, }}
        >
          Nutri-Voiceד
        </Text>

        <View style={{ gap: 8 }}>
          {menuItems.map((item: MenuItem) => {
            const active = pathname.startsWith(item.href);

            return (
              <Link key={item.href} href={item.href as any} asChild>
                <Pressable
                  style={{
                    flexDirection: "row-reverse",
                    alignItems: "center",
                    paddingVertical: 14,
                    paddingHorizontal: 20,
                    backgroundColor: active ? "#2563eb" : "transparent",
                  }}
                >
                  <Ionicons
                    name={item.icon as keyof typeof Ionicons.glyphMap}
                    size={22}
                    color={active ? "#ffffff" : "#374151"}
                    style={{ marginLeft: 12 }}
                  />

                  <Text
                    style={{
                      color: active ? "#ffffff" : "#374151",
                      fontSize: 16,
                      fontWeight: active ? "700" : "500",
                    }}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              </Link>
            );
          })}
        </View>
      </View>

      {/* חלק תחתון – כפתור התנתקות */}
      <Pressable
        onPress={handleLogout}
        style={{
          flexDirection: "row-reverse",
          alignItems: "center",
          paddingVertical: 16,
          paddingHorizontal: 20,
          borderTopWidth: 1,
          borderTopColor: "#e5e7eb",
        }}
      >
        <Ionicons
          name="log-out-outline"
          size={22}
          color="#dc2626"
          style={{ marginLeft: 12 }}
        />
        <Text
          style={{
            color: "#dc2626",
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          התנתקות
        </Text>
      </Pressable>
    </View>
  );
}
