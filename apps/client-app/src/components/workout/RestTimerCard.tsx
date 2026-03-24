import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { NeonCard } from "@/components/ui/NeonCard";
import { colors } from "@/constants/colors";
import { spacing } from "@/constants/layout";

type RestTimerCardProps = {
  seconds: number;
};

export function RestTimerCard({ seconds }: RestTimerCardProps) {
  if (seconds <= 0) {
    return null;
  }

  return (
    <NeonCard>
      <View style={styles.container}>
        <Ionicons name="timer-outline" size={20} color={colors.neon} />
        <Text style={styles.value}>{seconds} שנ׳</Text>
        <Text style={styles.label}>מנוחה פעילה</Text>
      </View>
    </NeonCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between"
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600"
  },
  value: {
    color: colors.neon,
    fontSize: 20,
    fontWeight: "800"
  }
});
