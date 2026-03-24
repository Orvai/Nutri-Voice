import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NutritionDayType } from "@/types/nutrition/nutrition.ui";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";

type DayTypeTabsProps = {
  value: NutritionDayType;
  onChange: (next: NutritionDayType) => void;
  disabled?: boolean;
};

export function DayTypeTabs({ value, onChange, disabled }: DayTypeTabsProps) {
  return (
    <View style={styles.tabs}>
      <Pressable
        disabled={disabled}
        style={[styles.tab, value === "training" && styles.activeTab]}
        onPress={() => onChange("training")}
      >
        <Text style={[styles.label, value === "training" && styles.activeLabel]}>
          יום העמסה
        </Text>
      </Pressable>
      <Pressable
        disabled={disabled}
        style={[styles.tab, value === "rest" && styles.activeTab]}
        onPress={() => onChange("rest")}
      >
        <Text style={[styles.label, value === "rest" && styles.activeLabel]}>יום ללא העמסה</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  tabs: {
    flexDirection: "row-reverse",
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 4
  },
  tab: {
    flex: 1,
    minHeight: 40,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center"
  },
  activeTab: {
    backgroundColor: colors.neon
  },
  label: {
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600"
  },
  activeLabel: {
    color: colors.black,
    fontWeight: "700"
  }
});
