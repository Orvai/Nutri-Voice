import React, { useMemo, useState, useCallback } from "react";
import { ScrollView, View, RefreshControl, Text } from "react-native";
import { useQueryClient, useQueries } from "@tanstack/react-query";
import { getApiTrackingDailyStateRange } from "@common/api/sdk/nutri-api";

import { styles } from "./styles";

import CoachDashboardHeader from "./CoachDashboardHeader";
import Section from "./sections/Section";
import CoachRangePicker from "./CoachRangePicker";

import InboxPreviewSection from "./sections/InboxPreview/InboxPreviewSection";
import ClientsSnapshotSection from "./sections/ClientsSnapshot/ClientsSnapshotSection";
import MissingTodaySection from "./sections/MissingToday/MissingTodaySection";
import type { ClientTrackingSnapshot, DateRangeValue } from "./types";
import { isDayLogged } from "./utils";

import { useClients } from "@/hooks/clients/useClients";
import { useCoachConversations } from "../../hooks/coversation/useCoachConversations";
import { mapDailyStateList } from "@/mappers/tracking/daily-state-list.mapper";
import type { DailyState } from "@/types/ui/tracking/daily-state.ui";
import type { ClientExtended } from "@/types/client";

import { clientKeys } from "@/queryKeys/clientKeys";
import { conversationKeys } from "@/queryKeys/conversationKeys";
import { trackingKeys } from "@/queryKeys/trackingKeys";

const RECENT_CONVERSATIONS_LIMIT = 6;
const CLIENTS_SCAN_STEP = 10;

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseISODate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function diffDaysInclusive(startDate: string, endDate: string): number {
  const start = parseISODate(startDate);
  const end = parseISODate(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  return Math.max(1, Math.floor((end.getTime() - start.getTime()) / 86400000) + 1);
}

function defaultRange(days: number): DateRangeValue {
  const end = new Date();
  const start = new Date(end);
  start.setDate(end.getDate() - (days - 1));
  return {
    startDate: toISODate(start),
    endDate: toISODate(end),
  };
}

function extractDayDate(day: DailyState): string | null {
  const rawDate = day.weight?.date || day.meals?.[0]?.date || day.workouts?.[0]?.date;
  return rawDate ? rawDate.slice(0, 10) : null;
}

function roundPercent(numerator: number, denominator: number): number {
  if (!denominator) return 0;
  return Math.max(0, Math.min(100, Math.round((numerator / denominator) * 100)));
}

function buildClientTrackingSnapshot(
  client: ClientExtended,
  dailyStates: DailyState[] | undefined,
  isLoading: boolean,
  rangeDays: number
): ClientTrackingSnapshot {
  const states = dailyStates ?? [];

  let loggedDays = 0;
  let targetDays = 0;
  let adherenceDays = 0;
  let workoutLogs = 0;
  let lastReportDate: string | null = null;
  let latestWorkout: ClientTrackingSnapshot["latestWorkout"] = null;
  const sleepValues: number[] = [];

  for (const day of states) {
    const logged = isDayLogged(day);
    if (logged) {
      loggedDays += 1;
      const dayDate = extractDayDate(day);
      if (dayDate && (!lastReportDate || dayDate > lastReportDate)) {
        lastReportDate = dayDate;
      }
    }

    workoutLogs += day.workouts?.length || 0;
    for (const workout of day.workouts || []) {
      const workoutDate = workout.date?.slice(0, 10) || null;
      if (!latestWorkout || (workoutDate && latestWorkout.date && workoutDate > latestWorkout.date) || (workoutDate && !latestWorkout.date)) {
        latestWorkout = {
          date: workoutDate,
          workoutType: workout.workoutType,
          effortLevel: workout.effortLevel,
          notes: workout.notes || null,
          exercisesCount: workout.exercises?.length || 0,
        };
      }
    }

    const target =
      day.dayType === "TRAINING"
        ? day.calorieTargets?.trainingDay
        : day.dayType === "REST"
        ? day.calorieTargets?.restDay
        : null;

    if (target != null) {
      targetDays += 1;
      const delta = (day.consumedCalories || 0) - target;
      if (Math.abs(delta) <= 120) adherenceDays += 1;
    }

    if (day.metrics?.sleepHours != null && day.metrics.sleepHours > 0) {
      sleepValues.push(day.metrics.sleepHours);
    }
  }

  const averageSleepHours =
    sleepValues.length > 0
      ? Number(
          (
            sleepValues.reduce((sum, value) => sum + value, 0) / sleepValues.length
          ).toFixed(1)
        )
      : null;

  return {
    client,
    isLoading,
    loggedDays,
    reportRate: roundPercent(loggedDays, rangeDays),
    targetDays,
    adherenceDays,
    adherenceRate: targetDays > 0 ? roundPercent(adherenceDays, targetDays) : null,
    workoutLogs,
    latestWorkout,
    averageSleepHours,
    lastReportDate,
  };
}

function formatShortDate(dateIso: string): string {
  return parseISODate(dateIso).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
}

export default function CoachDashboard() {
  const qc = useQueryClient();

  const [search, setSearch] = useState("");
  const [scanLimit, setScanLimit] = useState(CLIENTS_SCAN_STEP);
  const [range, setRange] = useState<DateRangeValue>(() => defaultRange(30));

  const clientsQ = useClients();
  const convQ = useCoachConversations(undefined);

  const clients = clientsQ.data ?? [];
  const conversations = convQ.data ?? [];
  const rangeDays = useMemo(
    () => diffDaysInclusive(range.startDate, range.endDate),
    [range.endDate, range.startDate]
  );

  const filteredClients = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clients;
    return clients.filter((c) => (c.name || "").toLowerCase().includes(q));
  }, [clients, search]);

  const scanClients = useMemo(
    () => filteredClients.slice(0, scanLimit),
    [filteredClients, scanLimit]
  );

  const trackingQueries = useQueries({
    queries: scanClients.map((client) => ({
      queryKey: trackingKeys.rangeState(range.startDate, range.endDate, client.id),
      queryFn: async ({ signal }: { signal: AbortSignal }) => {
        const response = await getApiTrackingDailyStateRange(
          {
            startDate: range.startDate,
            endDate: range.endDate,
            clientId: client.id,
          },
          signal
        );
        return mapDailyStateList(response);
      },
      enabled: !!client.id,
      staleTime: 60_000,
    })),
  });

  const trackingRows: ClientTrackingSnapshot[] = scanClients.map((client, index) =>
    buildClientTrackingSnapshot(
      client,
      (trackingQueries[index]?.data as DailyState[] | undefined) ?? [],
      Boolean(trackingQueries[index]?.isLoading),
      rangeDays
    )
  );

  const trackingLoading = trackingQueries.some((query) => query.isLoading);
  const resolvedRows = trackingRows.filter((row) => !row.isLoading);
  const missingRows = resolvedRows.filter((row) => row.loggedDays === 0);

  const summary = useMemo(() => {
    const clientsCount = resolvedRows.length;
    const totalLoggedDays = resolvedRows.reduce((sum, row) => sum + row.loggedDays, 0);
    const totalWorkoutLogs = resolvedRows.reduce((sum, row) => sum + row.workoutLogs, 0);
    const totalTargetDays = resolvedRows.reduce((sum, row) => sum + row.targetDays, 0);
    const totalAdherenceDays = resolvedRows.reduce((sum, row) => sum + row.adherenceDays, 0);
    const activeClients = resolvedRows.filter((row) => row.loggedDays > 0).length;

    return {
      reportingRate: roundPercent(totalLoggedDays, clientsCount * rangeDays),
      adherenceRate: totalTargetDays ? roundPercent(totalAdherenceDays, totalTargetDays) : null,
      totalWorkoutLogs,
      activeClients,
      noReportClients: resolvedRows.filter((row) => row.loggedDays === 0).length,
      resolvedClients: clientsCount,
    };
  }, [rangeDays, resolvedRows]);

  const recentConversations = useMemo(() => {
    const sorted = [...conversations].sort((a, b) => {
      const at = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
      const bt = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
      return bt - at;
    });
    return sorted.slice(0, RECENT_CONVERSATIONS_LIMIT);
  }, [conversations]);

  const onLoadMoreClients = () => setScanLimit((x) => x + CLIENTS_SCAN_STEP);

  const refresh = useCallback(async () => {
    await Promise.all([
      qc.invalidateQueries({ queryKey: clientKeys.list(), exact: false }),
      qc.invalidateQueries({ queryKey: conversationKeys.all, exact: false }),
      qc.invalidateQueries({ queryKey: trackingKeys.all, exact: false }),
    ]);
  }, [qc]);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.page}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={clientsQ.isFetching || convQ.isFetching || trackingLoading}
          onRefresh={refresh}
        />
      }
    >
      <CoachDashboardHeader
        totalClients={clients.length}
        totalConversations={conversations.length}
        search={search}
        onChangeSearch={setSearch}
      />

      <Section title="תקופת ניתוח" subtitle="בחירת טווח תאריכים מהלוח או מטווחים מהירים">
        <CoachRangePicker range={range} onChange={setRange} />
      </Section>

      <Section
        title="KPI תקופתי"
        subtitle={`טווח: ${formatShortDate(range.startDate)} - ${formatShortDate(
          range.endDate
        )}`}
      >
        <View style={styles.kpiGrid}>
          <View style={[styles.kpiCard, styles.kpiCardStrong]}>
            <Text style={styles.kpiLabel}>שיעור דיווחים</Text>
            <Text style={styles.kpiValue}>{summary.reportingRate}%</Text>
            <Text style={styles.kpiMeta}>מתוך כל ימי הטווח</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>עמידה ביעד קלורי</Text>
            <Text style={styles.kpiValue}>
              {summary.adherenceRate == null ? "—" : `${summary.adherenceRate}%`}
            </Text>
            <Text style={styles.kpiMeta}>רק בימים עם יעד מוגדר</Text>
          </View>

          <View style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>אימונים מדווחים</Text>
            <Text style={styles.kpiValue}>{summary.totalWorkoutLogs}</Text>
            <Text style={styles.kpiMeta}>סך הכל בטווח שנבחר</Text>
          </View>

          <View style={[styles.kpiCard, summary.noReportClients > 0 && styles.kpiCardAlert]}>
            <Text style={styles.kpiLabel}>לקוחות פעילים</Text>
            <Text style={styles.kpiValue}>{summary.activeClients}</Text>
            <Text style={styles.kpiMeta}>
              {summary.resolvedClients
                ? `${summary.noReportClients} ללא דיווח מתוך ${summary.resolvedClients}`
                : "ממתין לנתונים"}
            </Text>
          </View>
        </View>
      </Section>

      <Section
        title="Inbox – מה דורש טיפול"
        subtitle={`מציג ${RECENT_CONVERSATIONS_LIMIT} שיחות אחרונות (בשביל ביצועים)`}
      >
        <InboxPreviewSection loading={convQ.isLoading} conversations={recentConversations} />
      </Section>

      <Section
        title="מעקב מתאמנים בתקופה"
        subtitle={`מציג ${trackingRows.length} מתאמנים (סריקה מדורגת לביצועים)`}
      >
        <ClientsSnapshotSection
          loading={clientsQ.isLoading && trackingRows.length === 0}
          rows={trackingRows}
          onLoadMore={onLoadMoreClients}
        />
      </Section>

      <Section title="מי לא דיווח בכלל בטווח" subtitle="רשימת מתאמנים שדורשים פולואפ">
        <MissingTodaySection
          loading={clientsQ.isLoading && trackingRows.length === 0}
          rows={missingRows}
          onScanMore={onLoadMoreClients}
        />
      </Section>

      <View style={{ height: 26 }} />
    </ScrollView>
  );
}
