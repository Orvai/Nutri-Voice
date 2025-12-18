import { View, Pressable, Text } from "react-native";
import { styles } from "./styles/ProfileTabs.styles";

const tabs = [
  { id: "today", label: "היום" },
  { id: "nutrition", label: "תוכניות תזונה" },
  { id: "workout", label: "תוכניות אימון" },
  { id: "progress", label: "התקדמות" },
  { id: "chat", label: "צ'אט" },
];

export default function ProfileTabs({ active, onChange }) {
  return (
    <View style={styles.container}>
      {tabs.map((t) => {
        const isActive = active === t.id;
        return (
          <Pressable
            key={t.id}
            onPress={() => onChange(t.id)}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <Text
              style={isActive ? styles.labelActive : styles.labelInactive}
            >
              {t.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
