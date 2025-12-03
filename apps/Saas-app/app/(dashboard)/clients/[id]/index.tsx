import { ScrollView, View } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import React from "react";


import { useClientProfile } from "../../../../src/hooks/useClientProfile";

import ProfileHeader from "../../../../src/components/client-profile/ProfileHeader";
import ProfileTabs from "../../../../src/components/client-profile/ProfileTabs";

import TodayCalories from "../../../../src/components/client-profile/TodayTab/TodayCalories";
import TodayStats from "../../../../src/components/client-profile/TodayTab/TodayStats";
import TodayMeals from "../../../../src/components/client-profile/TodayTab/TodayMeals";
import TodayWorkout from "../../../../src/components/client-profile/TodayTab/TodayWorkout";
import TodayMessages from "../../../../src/components/client-profile/TodayTab/TodayMessages";
import NutritionTab from "./NutritionTab";
import WorkoutTab from "./WorkoutTab";

import Text from "../../../../src/components/ui/Text";
import ProgressTab from "./ProgressTab";

export default function ClientProfileScreen() {
  const { id } = useLocalSearchParams();
  const { client } = useClientProfile(id as string);
  const [activeTab, setActiveTab] = useState("today");

  if (!client) return null;

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      <ProfileHeader client={client} />
      <ProfileTabs active={activeTab} onChange={setActiveTab} />

      <ScrollView style={{ flex: 1, padding: 20 }}>
        {activeTab === "today" && (
          <>
            <TodayCalories data={client.today.calories} />
            <TodayStats stats={client.today.quickStats} />
            <TodayMeals meals={client.today.meals} />
            <TodayWorkout workout={client.today.workout} />
            <TodayMessages messages={client.today.messages} />
          </>
        )}

        {activeTab === "nutrition" && (
          <NutritionTab  client={client} />
        )}
        {activeTab === "workout" && (
          <WorkoutTab client={client} />
        )}

        {activeTab === "progress" && (
          <ProgressTab client={client} />
        )}

        {activeTab === "chat" && (
          <View><Text>מסך צ׳אט עם הלקוח</Text></View>
        )}
      </ScrollView>
    </View>
  );
}
