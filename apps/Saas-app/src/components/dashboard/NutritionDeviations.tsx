import { View, Image, Pressable } from 'react-native';
import Card from '../ui/Card';
import Text from '../ui/Text';
import { styles } from './styles/NutritionDeviations.styles';

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
      <View style={styles.header}>
        <Text weight="bold" size={18}>חריגות תזונה</Text>
        <Text size={12} color="#f97316">{data.length}</Text>
      </View>

      <View style={styles.listContainer}>
        {data.map((item, i) => (
          <View
            key={i}
            style={[styles.itemContainer, { backgroundColor: colors[item.color] }]}
          >
            <View style={styles.itemHeader}>
              <View style={styles.itemRow}>
                <Image
                  source={{ uri: item.avatar }}
                  style={styles.image}
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

            <View style={styles.actionsRow}>
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