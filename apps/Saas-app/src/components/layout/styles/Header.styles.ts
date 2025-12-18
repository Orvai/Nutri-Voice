import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    height: 70,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingHorizontal: 20,
    justifyContent: "space-between", // 👈 זה המפתח!
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
});