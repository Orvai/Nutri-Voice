import React from "react";
import { View, ActivityIndicator, Text, Pressable } from "react-native";
import { styles } from "../../styles";

import type { ClientTrackingSnapshot } from "../../types";
import ClientStatusCard from "./ClientStatusCard";

export default function ClientsSnapshotSection({
  loading,
  rows,
  onLoadMore,
}: {
  loading: boolean;
  rows: ClientTrackingSnapshot[];
  onLoadMore: () => void;
}) {
  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!rows.length) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>אין לקוחות</Text>
        <Text style={[styles.text, { marginTop: 6 }]}>כשתוסיף לקוחות – הם יופיעו כאן.</Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      {rows.map((row) => (
        <ClientStatusCard key={row.client.id} row={row} />
      ))}

      <Pressable style={styles.secondaryBtn} onPress={onLoadMore}>
        <Text style={styles.secondaryBtnText}>טען עוד</Text>
      </Pressable>
    </View>
  );
}
