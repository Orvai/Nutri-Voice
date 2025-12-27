import React from "react";
import { View, ActivityIndicator, Text, Pressable } from "react-native";
import { styles } from "../../styles";

import type { ClientExtended } from "@/types/client";
import ClientStatusCard from "./ClientStatusCard";

export default function ClientsSnapshotSection({
  loading,
  clients,
  onLoadMore,
}: {
  loading: boolean;
  clients: ClientExtended[];
  onLoadMore: () => void;
}) {
  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!clients.length) {
    return (
      <View style={styles.card}>
        <Text style={styles.title}>אין לקוחות</Text>
        <Text style={[styles.text, { marginTop: 6 }]}>כשתוסיף לקוחות – הם יופיעו כאן.</Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      {clients.map((c) => (
        <ClientStatusCard key={c.id} client={c} />
      ))}

      <Pressable style={styles.secondaryBtn} onPress={onLoadMore}>
        <Text style={styles.secondaryBtnText}>טען עוד</Text>
      </Pressable>
    </View>
  );
}
