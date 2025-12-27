import React, { useState } from "react";
import { ScrollView, View, ActivityIndicator, RefreshControl } from "react-native";
import { useLocalSearchParams } from "expo-router";

// Hooks
import { useClientProfile } from "../../../../src/hooks/useClientProfile";
import { useDailyState } from "../../../../src/hooks/tracking/useDailyState";

// Components
import ProfileHeader from "../../../../src/components/client-profile/ProfileHeader";
import ProfileTabs from "../../../../src/components/client-profile/ProfileTabs";
import Text from "../../../../src/components/ui/Text";

// Tabs
import TodayCalories from "../../../../src/components/client-profile/TodayTab/TodayCalories";
import TodayStats from "../../../../src/components/client-profile/TodayTab/TodayStats";
import TodayMeals from "../../../../src/components/client-profile/TodayTab/TodayMeals";
import TodayWorkout from "../../../../src/components/client-profile/TodayTab/TodayWorkout";
import NutritionTab from "./NutritionTab";
import WorkoutTab from "./WorkoutTab";
import ProgressTab from "./ProgressTab";

export default function ClientProfileScreen() {
  const { id } = useLocalSearchParams();
  const { client, loading } = useClientProfile(id as string);
  const { refetch: refetchState } = useDailyState(id as string); 
  
  const [activeTab, setActiveTab] = useState("today");
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchState();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6" }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (!client) return null;

  const renderTabContent = () => {
    switch (activeTab) {
      case "today":
        return (
          <View style={{ gap: 20 }}>
            <TodayCalories data={client.today.calories} />
            <TodayStats stats={client.today.quickStats} />
            {client.today.meals.length > 0 && <TodayMeals meals={client.today.meals} />}
            {client.today.workout && <TodayWorkout workout={client.today.workout} />}
          </View>
        );
      case "nutrition":
        return <NutritionTab client={client} />;
      case "workout":
        return <WorkoutTab client={client} />;
      case "progress":
        return <ProgressTab client={client} />;
      default:
        return null;
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <ProfileHeader client={client} />
      
      <ProfileTabs active={activeTab} onChange={setActiveTab} />

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {renderTabContent()}
      </ScrollView>
    </View>
  );
}