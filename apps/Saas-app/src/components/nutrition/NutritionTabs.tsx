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
      {tabs.map((tab) => (
        <Pressable
          key={tab.id}
          onPress={() => onChange(tab.id)}
          style={{
            paddingVertical: 10,
            paddingHorizontal: 20,
            backgroundColor: active === tab.id ? "#e0f2fe" : "transparent",
            borderBottomWidth: active === tab.id ? 2 : 1,
            borderBottomColor: active === tab.id ? "#0284c7" : "#e5e7eb",
          }}
        >
          <Text
            style={{
              fontWeight: active === tab.id ? "700" : "500",
              color: active === tab.id ? "#0284c7" : "#6b7280",
            }}
          >
            {tab.label}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
