// src/components/nutrition/NutritionTabs.tsx
import { View, Pressable, Text } from "react-native";

type Tab = {
  id: string;
  label: string;
};

type Props = {
  tabs: Tab[];
  active: string | null;
  onChange: (id: string) => void;
};

export default function NutritionTabs({ tabs, active, onChange }: Props) {
  return (
    <View style={{ flexDirection: "row-reverse", gap: 8, marginBottom: 16 }}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;

        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            style={{
              paddingVertical: 10,
              paddingHorizontal: 20,
              backgroundColor: isActive ? "#e0f2fe" : "transparent",
              borderBottomWidth: isActive ? 3 : 1,
              borderBottomColor: isActive ? "#0284c7" : "#e5e7eb",
              borderTopLeftRadius: 6,
              borderTopRightRadius: 6,
            }}
          >
            <Text
              style={{
                fontWeight: isActive ? "700" : "500",
                color: isActive ? "#0284c7" : "#6b7280",
              }}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
