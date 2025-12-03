import { View, Image, Pressable } from 'react-native';
import Card from '../ui/Card';
import Text from '../ui/Text';

interface RiskClient {
  name: string;
  avatar: string;
  lastReportDays: number;
  calorieStatus: number;
  lastWorkout: string;
}

interface Props {
  data: RiskClient[];
}

export default function AtRiskClients({ data }: Props) {
  return (
    <Card>
      <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
        <Text weight="bold" size={18}>לקוחות למעקב</Text>
        <Text size={12} color="#dc2626">{data.length}</Text>
      </View>

      <View style={{ marginTop: 12, gap: 14 }}>
        {data.map((item, i) => (
          <View
            key={i}
            style={{
              padding: 12,
              backgroundColor: '#fee2e2',
              borderRadius: 10,
            }}
          >
            <View style={{ flexDirection: 'row-reverse', gap: 12 }}>
              <Image
                source={{ uri: item.avatar }}
                style={{ width: 48, height: 48, borderRadius: 24 }}
              />

              <View style={{ flex: 1 }}>
                <Text weight="medium">{item.name}</Text>
                <Text size={12} color="#6b7280">
                  {item.lastReportDays} ימים מאז דיווח אחרון
                </Text>
              </View>
            </View>

            <View style={{ marginTop: 8 }}>
              <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
                <Text size={12} color="#6b7280">מצב קלורי יומי:</Text>
                <Text
                  weight="bold"
                  size={12}
                  color={item.calorieStatus < 0 ? '#dc2626' : '#16a34a'}
                >
                  {item.calorieStatus}%
                </Text>
              </View>

              <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', marginTop: 4 }}>
                <Text size={12} color="#6b7280">אימון אחרון:</Text>
                <Text weight="bold" size={12}>
                  {item.lastWorkout}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row-reverse', gap: 12, marginTop: 12 }}>
              <Pressable style={{ flex: 1 }}>
                <Text size={12} color="#2563eb" weight="medium">צ'אט</Text>
              </Pressable>
              <Pressable style={{ flex: 1 }}>
                <Text size={12} color="#6b7280">פרופיל</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}
