import React, { useMemo } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

import { styles } from "../../styles";
import { isDayLogged } from "../../utils";

import type { ClientExtended } from "@/types/client";
import { useDailyState } from "@/hooks/tracking/useDailyState";

export default function ClientStatusCard({ client }: { client: ClientExtended }) {
  const router = useRouter();
  const { data: state, isLoading } = useDailyState(client.id);

  const logged = useMemo(() => isDayLogged(state), [state]);

  const openClient = () => {
    // TODO: תעדכן לנתיב האמיתי אצלך
    router.push(`/clients/${client.id}`);
  };

  const surface = logged ? styles.cardOk : styles.cardWarn;

  return (
    <View style={[styles.card, surface]}>
      <View style={[styles.rowReverse, { justifyContent: "space-between", gap: 10 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {client.name || "לקוח ללא שם"}
          </Text>
          <Text style={styles.meta}>{logged ? "דיווח היום ✅" : "לא דיווח היום ❌"}</Text>
        </View>

        <Pressable style={styles.ghostBtn} onPress={openClient}>
          <Text style={styles.ghostBtnText}>פרופיל</Text>
        </Pressable>
      </View>

      {isLoading ? (
        <View style={{ paddingTop: 10 }}>
          <ActivityIndicator />
        </View>
      ) : state ? (
        <View style={{ paddingTop: 10, gap: 6 }}>
          <View style={[styles.rowReverse, { gap: 10, flexWrap: "wrap" }]}>
            <Text style={styles.meta}>קל׳: {Math.round(state.consumedCalories || 0)}</Text>
            <Text style={styles.meta}>אימונים: {state.workouts?.length || 0}</Text>
            <Text style={styles.meta}>
              יעד:{" "}
              {state.dayType === "TRAINING"
                ? state.calorieTargets?.trainingDay ?? "—"
                : state.dayType === "REST"
                ? state.calorieTargets?.restDay ?? "—"
                : "—"}
            </Text>
          </View>

          {state.remainingCalories != null ? (
            <Text style={styles.text}>נותרו: {Math.round(state.remainingCalories)} קל׳</Text>
          ) : null}
        </View>
      ) : (
        <Text style={[styles.text, { paddingTop: 10 }]}>אין נתונים ליום הזה</Text>
      )}
    </View>
  );
}
