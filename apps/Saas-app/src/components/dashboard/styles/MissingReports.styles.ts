import { StyleSheet } from "react-native";
import { colors } from "src/styles/colors";

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  listContainer: {
    marginTop: 12,
    gap: 12,
  },
  itemContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    backgroundColor: colors.neutral50,
    padding: 12,
    borderRadius: 10,
  },
  itemRow: {
    flexDirection: 'row-reverse',
    gap: 8,
  },
  image: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
});