import { View, Pressable, Text } from "react-native";

const tabs = [
  { id: "today", label: "היום" },
  { id: "nutrition", label: "תוכניות תזונה" },
  { id: "workout", label: "תוכניות אימון" },
  { id: "progress", label: "התקדמות" },
  { id: "chat", label: "צ'אט" },
];

export default function ProfileTabs({ active, onChange }) {
  return (
    <View
      style={{
        flexDirection: "row-reverse",
        borderBottomWidth: 1,
        borderColor: "#e5e7eb",
        backgroundColor: "#fff",
        paddingHorizontal: 20,
      }}
    >
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <Pressable
            key={t.id}
            onPress={() => onChange(t.id)}
            style={{
              paddingVertical: 14,
              marginLeft: 20,
              borderBottomWidth: isActive ? 2 : 0,
              borderColor: "#2563eb",
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: isActive ? "700" : "500",
                color: isActive ? "#2563eb" : "#6b7280",
              }}
            >
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
