import { View, Image, Pressable } from 'react-native';
import Card from '../ui/Card';
import Text from '../ui/Text';

interface Deviation {
  name: string;
  avatar: string;
  meal: string;
  calories: number;
  color: 'red' | 'yellow' | 'green';
}

interface Props {
  data: Deviation[];
}

const colors = {
  red: '#fee2e2',
  yellow: '#fef9c3',
  green: '#dcfce7',
};

export default function NutritionDeviations({ data }: Props) {
  return (
    <Card>
      <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
        <Text weight="bold" size={18}>חריגות תזונה</Text>
        <Text size={12} color="#f97316">{data.length}</Text>
      </View>

      <View style={{ marginTop: 12, gap: 12 }}>
        {data.map((item, i) => (
          <View
            key={i}
            style={{
              backgroundColor: colors[item.color],
              borderRadius: 10,
              padding: 12,
            }}
          >
            <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row-reverse', gap: 8 }}>
                <Image
                  source={{ uri: item.avatar }}
                  style={{ width: 32, height: 32, borderRadius: 16 }}
                />
                <View>
                  <Text weight="medium">{item.name}</Text>
                  <Text size={12} color="#6b7280">{item.meal}</Text>
                </View>
              </View>

              <Text
                weight="bold"
                size={14}
                color={
                  item.calories > 0
                    ? '#dc2626'
                    : item.calories < 0
                    ? '#16a34a'
                    : '#000'
                }
              >
                {item.calories > 0 ? '+' : ''}
                {item.calories} קל'
              </Text>
            </View>

            <View style={{ marginTop: 6, flexDirection: 'row-reverse', gap: 12 }}>
              <Pressable>
                <Text size={12} color="#2563eb">תוכנית תזונה</Text>
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
