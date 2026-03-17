import React from "react";
import { View, Pressable, Text, ActivityIndicator } from "react-native";
import { styles } from "../../styles";

import type { ClientTrackingSnapshot } from "../../types";
import MissingTodayRow from "../MissingToday/MissingTodayRow";

export default function MissingTodaySection({
  loading,
  rows,
  onScanMore,
}: {
  loading: boolean;
  rows: ClientTrackingSnapshot[];
  onScanMore: () => void;
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
      <View style={[styles.card, styles.cardOk]}>
        <Text style={styles.title}>כולם דיווחו בטווח שנבחר</Text>
        <Text style={[styles.text, { marginTop: 6 }]}>
          לא נמצאו מתאמנים ללא דיווחים בכלל בתקופה.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 10 }}>
      {rows.map((row) => (
        <MissingTodayRow key={row.client.id} row={row} />
      ))}

      <Pressable style={styles.secondaryBtn} onPress={onScanMore}>
        <Text style={styles.secondaryBtnText}>סרוק עוד</Text>
      </Pressable>
    </View>
  );
}
