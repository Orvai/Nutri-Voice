import { colors } from './colors';
import { fonts } from './fonts';

export const theme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 20,
    xl: 28,
  },
  radius: {
    sm: 6,
    md: 10,
    lg: 16,
    full: 999,
  },
  shadow: {
    card: {
      shadowColor: colors.neutral800,
      shadowOpacity: 0.06,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },
  },
  fonts,
  colors,
};