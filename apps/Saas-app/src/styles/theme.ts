import { colors } from './colors';
import { fonts } from './fonts';

// פונקציה עזר להמרת RGB (עבור שקיפות)
function hexToRgba(hex: string, alpha: number) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  
  // אם צבע הקלט הוא #111827
  // r=17, g=24, b=39
  
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// הגדרות הצל המקוריות שלך:
// shadowColor: colors.neutral800 ('#111827')
// shadowOpacity: 0.06
// shadowRadius: 12 (Blur)
// shadowOffset: { width: 0, height: 6 } (Offset X, Offset Y)

const shadowColorRgba = hexToRgba(colors.neutral800, 0.06);
const boxShadowValue = `0px 6px 12px ${shadowColorRgba}`; // Offset X, Offset Y, Blur, Color

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
      // **התיקון:** המרה לפורמט CSS boxShadow עבור Web
      boxShadow: boxShadowValue,
      // משאירים elevation עבור Android
      elevation: 3, 
    },
  },
  fonts,
  colors,
};