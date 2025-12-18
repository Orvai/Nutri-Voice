import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  listContainer: {
    marginTop: 12,
    gap: 14,
  },
  itemContainer: {
    padding: 12,
    backgroundColor: '#fee2e2',
    borderRadius: 10,
  },
  row: {
    flexDirection: 'row-reverse',
    gap: 12,
  },
  infoContainer: {
    flex: 1,
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailsRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  secondaryRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row-reverse',
    gap: 12,
    marginTop: 12,
  },
  button: {
    flex: 1,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
});