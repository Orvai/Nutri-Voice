import { colors } from '../styles/colors';

export function kcalColor(delta: number) {
  if (delta > 50) return colors.danger;
  if (delta > 0) return colors.warning;
  return colors.success;
}