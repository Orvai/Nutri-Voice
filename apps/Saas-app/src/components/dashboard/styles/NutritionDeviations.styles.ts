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
    borderRadius: 10,
    padding: 12,
  },
  itemHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
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
  actionsRow: {
    marginTop: 6,
    flexDirection: 'row-reverse',
    gap: 12,
  },
});