import { View, Image, Pressable } from 'react-native';
import Card from '../ui/Card';
import Text from '../ui/Text';
import { styles } from './styles/MissingReports.styles';

interface Report {
  name: string;
  avatar: string;
  days: number;
  risk: 'high' | 'medium' | 'low' | 'rest';
  isTrainingDay?: boolean;
}

interface Props {
  data: Report[];
}

const riskColors = {
  high: '#fee2e2',
  medium: '#fef9c3',
  low: '#dcfce7',
  rest: '#e5e7eb',
};

export default function MissingReports({ data }: Props) {
  return (
    <Card>
      <View style={styles.header}>
        <Text weight="bold" size={18}>לקוחות שלא דיווחו</Text>
        <Text size={12} color="#f59e0b">{data.length}</Text>
      </View>

      <View style={styles.listContainer}>
        {data.map((item, i) => (
          <View
            key={i}
            style={styles.itemContainer}
          >
            <View style={styles.itemRow}>
              <Image
                source={{ uri: item.avatar }}
                style={styles.image}
              />

              <View>
                <Text weight="medium">{item.name}</Text>
                <Text size={12} color="#6b7280">
                  {item.days} ימים ללא דיווח
                </Text>
              </View>
            </View>

            <View style={styles.itemRow}>
              <Pressable>
                <Text size={12} color="#2563eb">תזכורת</Text>
              </Pressable>
              <Pressable>
                <Text size={12} color="#6b7280">צ'אט</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}