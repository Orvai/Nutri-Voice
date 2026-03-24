import { router } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { Screen } from "@/components/ui/Screen";
import { NeonCard } from "@/components/ui/NeonCard";
import { NeonButton } from "@/components/ui/NeonButton";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusView } from "@/components/ui/StatusView";
import { useHomeData } from "@/hooks/home/useHomeData";
import { colors } from "@/constants/colors";

export default function MessagesScreen() {
  const { data, isLoading, isError, refetch } = useHomeData();

  if (isLoading) {
    return (
      <Screen>
        <StatusView type="loading" title="טוען הודעות" />
      </Screen>
    );
  }

  if (isError || !data) {
    return (
      <Screen>
        <StatusView
          type="error"
          title="לא הצלחנו לטעון הודעות"
          actionLabel="נסה שוב"
          onActionPress={() => void refetch()}
        />
      </Screen>
    );
  }

  return (
    <Screen>
      <SectionHeader title="הודעות מהמאמן" actionLabel="חזור" onActionPress={() => router.back()} />

      <NeonCard>
        <View style={styles.container}>
          <Text style={styles.coach}>{data.coachTip.coachName}</Text>
          <Text style={styles.message}>{data.coachTip.message}</Text>
          <NeonButton
            label="המשך שיחה בעוזר"
            onPress={() =>
              router.push({
                pathname: "/(tabs)/assistant",
                params: { prompt: data.coachTip.message }
              })
            }
          />
        </View>
      </NeonCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8
  },
  coach: {
    color: colors.neon,
    fontSize: 15,
    fontWeight: "700",
    textAlign: "right"
  },
  message: {
    color: colors.textSecondary,
    fontSize: 14,
    textAlign: "right",
    lineHeight: 21
  }
});
