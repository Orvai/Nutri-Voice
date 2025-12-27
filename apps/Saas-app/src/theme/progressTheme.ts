// src/theme/progressTheme.ts
export const progressTheme = {
  colors: {
    // Screen
    bg: "#F8FAFC", // slate-50 (white system)
    bgAlt: "#FFFFFF",

    // Cards / surfaces
    surface: "#FFFFFF",
    surface2: "#F1F5F9", // slate-100
    surface3: "#E2E8F0", // slate-200

    border: "#E2E8F0", // slate-200

    // Text
    text: "#0F172A", // slate-900
    textMuted: "#334155", // slate-700
    textDim: "#64748B", // slate-500

    // Accent (only for CTA / selection)
    accent: "#7C3AED", // violet-600
    accentSoft: "rgba(124,58,237,0.12)",
    accentBorder: "rgba(124,58,237,0.25)",

    // Semantic
    success: "#16A34A",
    successSoft: "rgba(22,163,74,0.12)",
    successBorder: "rgba(22,163,74,0.22)",

    warning: "#D97706",
    warningSoft: "rgba(217,119,6,0.12)",
    warningBorder: "rgba(217,119,6,0.22)",

    danger: "#DC2626",
    dangerSoft: "rgba(220,38,38,0.12)",
    dangerBorder: "rgba(220,38,38,0.22)",
  },

  radius: {
    card: 16,
    sub: 14,
    pill: 999,
  },

  shadow: {
    card: {
      shadowColor: "#000",
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 2,
    },
  },
} as const;
