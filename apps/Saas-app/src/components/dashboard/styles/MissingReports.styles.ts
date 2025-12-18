import { StyleSheet } from "react-native";

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
    backgroundColor: '#f9fafb',
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