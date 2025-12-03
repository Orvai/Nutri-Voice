import { View, Image } from "react-native";
import { usePathname } from "expo-router";
import Text from "../ui/Text";
import { useAuth } from "../../context/AuthContext";

const titles: Record<string, string> = {
  "/(dashboard)/dashboard": "דשבורד",
  "/(dashboard)/clients": "לקוחות",
  "/(dashboard)/nutrition-plans": "תוכניות תזונה",
  "/(dashboard)/workout-plans": "תוכניות אימון",
  "/(dashboard)/chat": "שיחות",
  "/(dashboard)/ai-help": "AI-HELP",
  "/(dashboard)/settings": "הגדרות",
};

export default function Header() {
  const pathname = usePathname();
  const title = titles[pathname] || "";

  const { user } = useAuth();

  return (
    <View
      style={{
        height: 70,
        backgroundColor: "#ffffff",
        borderBottomWidth: 1,
        borderBottomColor: "#e5e7eb",
        flexDirection: "row-reverse",
        alignItems: "center",
        paddingHorizontal: 20,
        justifyContent: "space-between",   // 👈 זה המפתח!
      }}
    >
      {/* RIGHT SIDE → שלום + שם */}
      <Text weight="medium" size={18}>
        שלום, {user?.firstName} {user?.lastName}
      </Text>

      {/* LEFT SIDE → תמונת משתמש */}
      <Image
        source={{
          uri: user?.imageUrl
            ? user.imageUrl
            : "https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-1.jpg",
        }}
        style={{ width: 40, height: 40, borderRadius: 20 }}
      />
    </View>
  );
}
