import React from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "../../styles";
import type { ClientTrackingSnapshot } from "../../types";

function formatLastReport(date: string | null): string {
  if (!date) return "אין תאריך זמין";
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
  });
}

function pickStatus(reportRate: number, loggedDays: number) {
  if (loggedDays === 0) {
    return { text: "אין דיווחים בטווח", tone: styles.cardAttention };
  }
  if (reportRate < 45) {
    return { text: "דיווחים חלקיים", tone: styles.cardWarn };
  }
  return { text: "מעקב יציב", tone: styles.cardOk };
}

function effortLabel(level?: string | null): string {
  if (!level) return "—";
  if (level === "EASY") return "קל";
  if (level === "NORMAL") return "רגיל";
  if (level === "HARD") return "קשה";
  if (level === "FAILED") return "נכשל";
  if (level === "SKIPPED") return "דולג";
  return level;
}

export default function ClientStatusCard({ row }: { row: ClientTrackingSnapshot }) {
  const router = useRouter();
  const status = pickStatus(row.reportRate, row.loggedDays);

  const openClient = () => {
    router.push(`/clients/${row.client.id}`);
  };

  return (
    <View style={[styles.card, status.tone]}>
      <View style={[styles.rowReverse, { justifyContent: "space-between", gap: 10 }]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title} numberOfLines={1}>
            {row.client.name || "לקוח ללא שם"}
          </Text>
          <Text style={styles.meta}>{status.text}</Text>
        </View>

        <Pressable style={styles.ghostBtn} onPress={openClient}>
          <Text style={styles.ghostBtnText}>פרופיל</Text>
        </Pressable>
      </View>

      {row.isLoading ? (
        <View style={{ paddingTop: 10 }}>
          <ActivityIndicator />
        </View>
      ) : (
        <View style={{ paddingTop: 10, gap: 6 }}>
          <View style={[styles.rowReverse, { justifyContent: "space-between", gap: 10 }]}>
            <Text style={styles.meta}>
              ימי דיווח: {row.loggedDays}
            </Text>
            <Text style={styles.meta}>אימונים: {row.workoutLogs}</Text>
            <Text style={styles.meta}>שינה ממוצעת: {row.averageSleepHours ?? "—"}</Text>
          </View>

          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressFill,
                { width: `${Math.max(0, Math.min(100, row.reportRate))}%` },
              ]}
            />
          </View>

          <View style={[styles.rowReverse, { justifyContent: "space-between", gap: 10 }]}>
            <Text style={styles.text}>שיעור דיווח: {row.reportRate}%</Text>
            <Text style={styles.text}>
              עמידה יעד קלורי:{" "}
              {row.adherenceRate == null ? "—" : `${row.adherenceRate}% (${row.adherenceDays}/${row.targetDays})`}
            </Text>
          </View>

          {row.latestWorkout ? (
            <View style={[styles.card, { padding: 10, backgroundColor: "rgba(15,23,42,0.03)" }]}>
              <Text style={styles.meta}>
                אימון אחרון: {row.latestWorkout.workoutType} • עצימות {effortLabel(row.latestWorkout.effortLevel)}
              </Text>
              <Text style={styles.meta}>תרגילים: {row.latestWorkout.exercisesCount}</Text>
              {row.latestWorkout.notes ? (
                <Text style={styles.text} numberOfLines={2}>
                  הערה: {row.latestWorkout.notes}
                </Text>
              ) : null}
            </View>
          ) : null}

          <View style={[styles.rowReverse, { gap: 6 }]}>
            <Ionicons name="time-outline" size={14} color="rgba(17,24,39,0.6)" />
            <Text style={styles.meta}>דיווח אחרון: {formatLastReport(row.lastReportDate)}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
