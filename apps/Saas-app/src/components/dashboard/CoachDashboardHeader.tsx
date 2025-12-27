import React from "react";
import { View, Text, TextInput, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "./styles";

export default function CoachDashboardHeader({
  totalClients,
  totalConversations,
  search,
  onChangeSearch,
}: {
  totalClients: number;
  totalConversations: number;
  search: string;
  onChangeSearch: (v: string) => void;
}) {
  const today = new Date().toLocaleDateString("he-IL", {
    weekday: "long",
    day: "2-digit",
    month: "2-digit",
  });

  return (
    <View style={[styles.card, { gap: 12 }]}>
      <View style={[styles.rowReverse, { justifyContent: "space-between", gap: 12 }]}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 20, fontWeight: "900", color: "#111827", textAlign: "right" }}>
            דשבורד מאמן
          </Text>
          <Text style={styles.sectionSub}>{today}</Text>
        </View>

        <View style={{ flexDirection: "row-reverse", gap: 8 }}>
          <View style={styles.pill}>
            <Ionicons name="people" size={16} color="#111827" />
            <Text style={styles.pillText}>{totalClients} לקוחות</Text>
          </View>
          <View style={styles.pill}>
            <Ionicons name="chatbubbles" size={16} color="#111827" />
            <Text style={styles.pillText}>{totalConversations} שיחות</Text>
          </View>
        </View>
      </View>

      <View
        style={[
          styles.rowReverse,
          {
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 10,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(17,24,39,0.10)",
            backgroundColor: "#fff",
          },
        ]}
      >
        <Ionicons name="search" size={18} color="rgba(17,24,39,0.55)" />
        <TextInput
          value={search}
          onChangeText={onChangeSearch}
          placeholder="חיפוש לקוח…"
          placeholderTextColor="rgba(17,24,39,0.45)"
          style={{ flex: 1, textAlign: "right", color: "#111827", fontSize: 14 }}
        />
        {!!search && (
          <Pressable onPress={() => onChangeSearch("")} hitSlop={10}>
            <Ionicons name="close-circle" size={18} color="rgba(17,24,39,0.45)" />
          </Pressable>
        )}
      </View>
    </View>
  );
}
