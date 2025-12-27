// src/components/client-profile/progress/styles/StrengthProgressionList.styles.ts
import { StyleSheet } from "react-native";
import { progressTheme } from "../../../../theme/progressTheme";

export const styles = StyleSheet.create({
  container: {
    marginTop: 14,
  },

  headerRow: {
    flexDirection: "row-reverse",
    alignItems: "baseline",
    justifyContent: "space-between",
    marginBottom: 10,
  },

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
    textAlign: "left",
  },

  list: {
    gap: 10,
  },

  exerciseCard: {
    backgroundColor: progressTheme.colors.surface,
    borderRadius: progressTheme.radius.card,
    padding: 14,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
  },

  headerRowCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  exerciseName: {
    flex: 1,
    color: progressTheme.colors.text,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },

  badge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: progressTheme.radius.pill,
    borderWidth: 1,
  },

  positiveBadge: {
    backgroundColor: progressTheme.colors.successSoft,
    borderColor: progressTheme.colors.successBorder,
  },

  negativeBadge: {
    backgroundColor: progressTheme.colors.dangerSoft,
    borderColor: progressTheme.colors.dangerBorder,
  },

  badgeText: {
    color: progressTheme.colors.text,
    fontSize: 12,
    fontWeight: "900",
  },

  statusText: {
    marginTop: 8,
    color: progressTheme.colors.textMuted,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "right",
    writingDirection: "rtl",
  },

  statsRow: {
    marginTop: 12,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },

  statItem: {
    flex: 1,
    padding: 10,
    borderRadius: progressTheme.radius.sub,
    backgroundColor: progressTheme.colors.surface2,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
  },

  statLabel: {
    color: progressTheme.colors.textDim,
    fontSize: 12,
    fontWeight: "700",
    textAlign: "right",
    writingDirection: "rtl",
  },

  statValue: {
    marginTop: 6,
    color: progressTheme.colors.text,
    fontSize: 15,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },

  verticalDivider: {
    width: 1,
    height: 34,
    backgroundColor: progressTheme.colors.border,
  },

  emptyCard: {
    backgroundColor: progressTheme.colors.surface,
    borderRadius: progressTheme.radius.card,
    padding: 14,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
  },

  emptyText: {
    color: progressTheme.colors.textMuted,
    fontSize: 13,
    textAlign: "right",
    writingDirection: "rtl",
  },
});
