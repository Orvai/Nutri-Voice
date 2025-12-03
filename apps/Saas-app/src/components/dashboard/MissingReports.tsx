import { View, Image, Pressable } from 'react-native';
import Card from '../ui/Card';
import Text from '../ui/Text';

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
      <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
        <Text weight="bold" size={18}>לקוחות שלא דיווחו</Text>
        <Text size={12} color="#f59e0b">{data.length}</Text>
      </View>

      <View style={{ marginTop: 12, gap: 12 }}>
        {data.map((item, i) => (
          <View
            key={i}
            style={{
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
              backgroundColor: '#f9fafb',
              padding: 12,
              borderRadius: 10,
            }}
          >
            <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
              <Image
                source={{ uri: item.avatar }}
                style={{ width: 32, height: 32, borderRadius: 16 }}
              />

              <View>
                <Text weight="medium">{item.name}</Text>
                <Text size={12} color="#6b7280">
                  {item.days} ימים ללא דיווח
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
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
