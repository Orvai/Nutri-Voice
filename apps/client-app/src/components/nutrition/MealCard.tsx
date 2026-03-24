import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { NeonButton } from "@/components/ui/NeonButton";
import { NeonCard } from "@/components/ui/NeonCard";
import type { NutritionMeal } from "@/types/nutrition/nutrition.ui";
import { colors } from "@/constants/colors";
import { radius, spacing } from "@/constants/layout";

type MealCardProps = {
  meal: NutritionMeal;
  selectedProductName: string;
  selectedGrams: number;
  expanded: boolean;
  onToggle: () => void;
  onOpenPicker: () => void;
  onReport: () => void;
  onOpenDetails: () => void;
  isReporting: boolean;
};

export function MealCard({
  meal,
  selectedProductName,
  selectedGrams,
  expanded,
  onToggle,
  onOpenPicker,
  onReport,
  onOpenDetails,
  isReporting
}: MealCardProps) {
  return (
    <NeonCard>
      <View style={styles.container}>
        <Pressable style={styles.header} onPress={onToggle}>
          <Ionicons
            name={expanded ? "chevron-up-outline" : "chevron-down-outline"}
            color={colors.textSecondary}
            size={18}
          />
          <View style={styles.headerCopy}>
            <Text style={styles.title}>{meal.name}</Text>
            <Text style={styles.subtitle}>יעד {meal.targetCalories} קל׳</Text>
            {meal.logged ? (
              <Text style={styles.logged}>דווח: {meal.logged.grams} גרם · {meal.logged.calories} קל׳</Text>
            ) : null}
          </View>
          <View style={styles.iconWrap}>
            <Ionicons
              name={meal.icon as keyof typeof Ionicons.glyphMap}
              size={16}
              color={colors.neon}
            />
          </View>
        </Pressable>

        {expanded ? (
          <View style={styles.details}>
            <Pressable style={styles.picker} onPress={onOpenPicker}>
              <Text style={styles.pickerText}>{selectedProductName || "בחר מוצר"}</Text>
            </Pressable>

            <View style={styles.gramsRow}>
              <Pressable style={styles.stepButton} onPress={() => null} disabled>
                <Text style={styles.stepButtonText}>גרם</Text>
              </Pressable>
              <Text style={styles.gramsValue}>{selectedGrams} גרם</Text>
            </View>

            <View style={styles.actionsRow}>
              <NeonButton
                label="דווח ארוחה"
                onPress={onReport}
                loading={isReporting}
              />
              <NeonButton label="פרטי ארוחה" onPress={onOpenDetails} variant="secondary" />
            </View>
            <Text style={styles.note}>ניתן לבחור רק מוצרים מוגדרים מראש ע״י המאמן.</Text>
          </View>
        ) : null}
      </View>
    </NeonCard>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.sm
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  headerCopy: {
    flex: 1,
    alignItems: "flex-end",
    gap: 2
  },
  title: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "right"
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: "right"
  },
  logged: {
    color: colors.success,
    fontSize: 12,
    textAlign: "right"
  },
  iconWrap: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.neonSoft,
    borderWidth: 1,
    borderColor: colors.border
  },
  details: {
    gap: spacing.sm
  },
  picker: {
    minHeight: 44,
    justifyContent: "center",
    backgroundColor: colors.surfaceElevated,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md
  },
  pickerText: {
    color: colors.white,
    fontSize: 14,
    textAlign: "right"
  },
  gramsRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center"
  },
  stepButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surfaceElevated
  },
  stepButtonText: {
    color: colors.textSecondary,
    fontSize: 12
  },
  gramsValue: {
    color: colors.neon,
    fontSize: 14,
    fontWeight: "700"
  },
  actionsRow: {
    gap: spacing.xs
  },
  note: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: "right"
  }
});
