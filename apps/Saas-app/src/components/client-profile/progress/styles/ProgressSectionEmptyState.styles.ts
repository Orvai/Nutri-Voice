import { StyleSheet } from "react-native";

import { progressTheme } from "../../../../theme/progressTheme";

export const styles = StyleSheet.create({
  container: {
    backgroundColor: progressTheme.colors.surface,
    borderRadius: progressTheme.radius.card,
    borderWidth: 1,
    borderColor: progressTheme.colors.border,
    padding: 16,
    alignItems: "flex-end",
  },
  title: {
    color: progressTheme.colors.text,
    fontSize: 14,
    fontWeight: "900",
    textAlign: "right",
    writingDirection: "rtl",
  },
  message: {
    marginTop: 6,
    color: progressTheme.colors.textDim,
    fontSize: 12,
    lineHeight: 18,
    textAlign: "right",
    writingDirection: "rtl",
  },
});
