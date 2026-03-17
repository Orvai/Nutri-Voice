import React from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";

import { styles } from "../../styles";
import type { ClientTrackingSnapshot } from "../../types";

export default function MissingTodayRow({ row }: { row: ClientTrackingSnapshot }) {
  const router = useRouter();

  const openClient = () => {
    router.push(`/clients/${row.client.id}`);
  };

  return (
    <View style={[styles.card, styles.cardAttention]}>
      <View style={[styles.rowReverse, { justifyContent: "space-between", gap: 10 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {row.client.name || "לקוח ללא שם"}
          </Text>
          <Text style={styles.meta}>אין דיווחים בכלל בתקופה שנבחרה</Text>
        </View>

        <Pressable style={styles.ghostBtn} onPress={openClient}>
          <Text style={styles.ghostBtnText}>פרופיל</Text>
        </Pressable>
      </View>
    </View>
  );
}
