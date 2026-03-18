import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, View } from "react-native";
import Sidebar from "../../src/components/layout/Sidebar";
import Header from "../../src/components/layout/Header";
import { useAuth } from "../../src/context/AuthContext";

export default function DashboardLayout() {
  const { user, isHydrated } = useAuth();

  if (!isHydrated) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f3f4f6",
        }}
      >
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/login" />;
  }

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
