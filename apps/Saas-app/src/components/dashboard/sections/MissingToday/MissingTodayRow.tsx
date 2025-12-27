import React, { useMemo } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

import { styles } from "../../styles";
import { isDayLogged } from "../../utils";

import type { ClientExtended } from "@/types/client";
import { useDailyState } from "@/hooks/tracking/useDailyState";

export default function MissingTodayRow({ client }: { client: ClientExtended }) {
  const router = useRouter();
  const { data: state, isLoading } = useDailyState(client.id);

  const logged = useMemo(() => isDayLogged(state), [state]);

  if (isLoading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator />
      </View>
    );
  }

  if (logged) return null;

  const openClient = () => {
    // TODO: תעדכן לנתיב האמיתי אצלך
    router.push(`/clients/${client.id}`);
  };

  return (
    <View style={[styles.card, styles.cardAttention]}>
      <View style={[styles.rowReverse, { justifyContent: "space-between", gap: 10 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {client.name || "לקוח ללא שם"}
          </Text>
          <Text style={styles.meta}>לא דיווח היום</Text>
        </View>

        <Pressable style={styles.ghostBtn} onPress={openClient}>
          <Text style={styles.ghostBtnText}>פרופיל</Text>
        </Pressable>
      </View>
    </View>
  );
}
