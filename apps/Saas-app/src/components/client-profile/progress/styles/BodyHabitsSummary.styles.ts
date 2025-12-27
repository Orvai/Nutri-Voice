// src/components/client-profile/progress/styles/BodyHabitsSummary.styles.ts
import { StyleSheet } from "react-native";
import { progressTheme } from "../../../../theme/progressTheme";

export const styles = StyleSheet.create({
  container: { marginTop: 14 },

  headerRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },

  titleWrap: { flex: 1 },

  sectionTitle: {
    color: progressTheme.colors.text,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },

  sectionSub: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    marginTop: 3,
    textAlign: "right",
    writingDirection: "rtl",
  },

  card: {
    backgroundColor: progressTheme.colors.surface,
    borderRadius: progressTheme.radius.card,
    padding: 14,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
  },

  grid: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    gap: 10,
  },

  gridItem: {
    flex: 1,
    padding: 10,
    borderRadius: progressTheme.radius.sub,
    backgroundColor: progressTheme.colors.surface2,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
  },

  gridLabel: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    fontWeight: "800",
    textAlign: "right",
    writingDirection: "rtl",
  },

  gridValue: {
    marginTop: 6,
    color: progressTheme.colors.text,
    fontSize: 16,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },

  smallNote: {
    marginTop: 6,
    color: progressTheme.colors.textDim,
    fontSize: 11,
    textAlign: "right",
    writingDirection: "rtl",
  },

  good: { color: progressTheme.colors.success },
  neutral: { color: progressTheme.colors.text },
  bad: { color: progressTheme.colors.danger },
});
