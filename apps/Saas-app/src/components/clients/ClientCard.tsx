import React from 'react';
import { View, Pressable } from 'react-native';
import Card from '../../components/ui/Card';
import Text from '../../components/ui/Text';
import Avatar from '../../components/ui/Avatar';
import Chip from '../../components/ui/Chip';
import Spacer from '../../components/ui/Spacer';
import { colors } from '../../styles/colors';
import Button from '../../components/ui/Button';

export default function ClientCard({
  fullName,
  phone,
  activityScore,
  dietDeviationKcal,
  weeklyWeightChangeKg,
  isFlagged,
  onPress,
  onToggleFlag,
}: any) {

  const activityTone =
    activityScore >= 70 ? 'success' :
    activityScore >= 40 ? 'warning' :
    'danger';

  const deviationTone =
    dietDeviationKcal <= 200 ? 'success' :
    dietDeviationKcal <= 500 ? 'warning' :
    'danger';

  const weightTrend =
    weeklyWeightChangeKg > 0 ? '⬆️' :
    weeklyWeightChangeKg < 0 ? '⬇️' :
    '➖';

  return (
    <Pressable onPress={onPress}>
      <Card
        style={{
          borderColor: isFlagged ? colors.danger : colors.neutral200,
          borderWidth: isFlagged ? 2 : 1,
        }}
      >

        {/* ----- TOP ROW (Avatar + Info + Flag) ----- */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Avatar name={fullName} size={50} />

          <Spacer size={12} />

          <View style={{ flex: 1 }}>
            <Text weight="bold" variant="title">{fullName}</Text>
            <Text variant="caption" color={colors.neutral600}>
              {phone}
            </Text>
          </View>

          <Pressable onPress={onToggleFlag}>
            <Chip
              label={isFlagged ? "🚩" : "⚪"}
              tone={isFlagged ? "danger" : "default"}
              style={{ paddingHorizontal: 12 }}
            />
          </Pressable>
        </View>

        <Spacer size={14} />

        {/* ----- STATUS ROW ----- */}
        <View style={{ flexDirection: "row", gap: 10, flexWrap: "wrap" }}>
          <Chip tone={activityTone} label={`פעילות ${activityScore}`} />
          <Chip tone={deviationTone} label={`חריגה ${dietDeviationKcal}`} />
          <Chip label={`${weightTrend} ${Math.abs(weeklyWeightChangeKg)}kg`} />
        </View>

      </Card>
    </Pressable>
  );
}
