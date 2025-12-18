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
  messageContainer: {
    padding: 12,
    borderRadius: 10,
    flexDirection: 'row-reverse',
    gap: 12,
    alignItems: 'flex-start',
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  contentHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  messageText: {
    marginVertical: 4,
  },
});