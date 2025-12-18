// src/components/nutrition/NutritionTabs.tsx
import { View, Pressable, Text } from "react-native";
import { styles } from "./styles/NutritionTabs.styles";
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
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = active === tab.id;

        return (
          <Pressable
            key={tab.id}
            onPress={() => onChange(tab.id)}
            style={[
              styles.button,
              isActive ? styles.buttonActive : styles.buttonInactive,
            ]}
          >
            <Text
              style={[
                styles.text,
                isActive ? styles.textActive : styles.textInactive,
              ]}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}