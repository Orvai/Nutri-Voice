import { View } from 'react-native';
import Card from '../ui/Card';
import Text from '../ui/Text';
import { styles } from './styles/DailyKpis.styles';

interface Props {
  data: {
    dailyReports: number;
    calorieTarget: number;
    workoutCompletion: number;
    atRisk: number;
  };
}

export default function DailyKpis({ data }: Props) {
  const items = [
    { label: 'דיווח יומי', value: data.dailyReports, color: '#3B82F6' },
    { label: 'יעד קלורי', value: data.calorieTarget, color: '#10B981' },
    { label: 'אימונים שבוצעו', value: data.workoutCompletion, color: '#8B5CF6' },
    { label: 'לקוחות בסיכון', value: data.atRisk, color: '#EF4444' },
  ];

  return (
    <View style={styles.container}>
      {items.map((item, i) => (
        <Card
          key={i}
          style={{ ...styles.card, borderRightColor: item.color }}
        >
          <Text weight="bold" size={22}>
            {item.value}
          </Text>
          <Text size={14} color="#6b7280" style={styles.label}>
            {item.label}
          </Text>
        </Card>
      ))}
    </View>
  );
}