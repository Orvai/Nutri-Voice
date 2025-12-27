import React from "react";
import { View, Pressable, Text } from "react-native";
import { styles } from "../../styles";

import type { ClientExtended } from "@/types/client";
import MissingTodayRow from "../MissingToday/MissingTodayRow";

export default function MissingTodaySection({
  clients,
  onScanMore,
}: {
  clients: ClientExtended[];
  onScanMore: () => void;
}) {
  return (
    <View style={{ gap: 10 }}>
      {clients.map((c) => (
        <MissingTodayRow key={c.id} client={c} />
      ))}

      <Pressable style={styles.secondaryBtn} onPress={onScanMore}>
        <Text style={styles.secondaryBtnText}>סרוק עוד</Text>
      </Pressable>
    </View>
  );
}
