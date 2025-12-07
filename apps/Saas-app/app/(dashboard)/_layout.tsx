import { Slot } from "expo-router";
import { View } from "react-native";
import Sidebar from "../../src/components/layout/Sidebar";
import Header from "../../src/components/layout/Header";

export default function DashboardLayout() {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: "row-reverse",
        backgroundColor: "#f3f4f6",
      }}
    >
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <View style={{ flex: 1 }}>
        <Header />

        <Slot />
      </View>
    </View>
  );
}
