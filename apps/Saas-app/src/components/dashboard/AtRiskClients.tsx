import { View, Image, Pressable } from 'react-native';
import Card from '../ui/Card';
import Text from '../ui/Text';
import { styles } from './styles/AtRiskClients.styles';

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
      <View style={styles.header}>
        <Text weight="bold" size={18}>לקוחות למעקב</Text>
        <Text size={12} color="#dc2626">{data.length}</Text>
      </View>

      <View style={styles.listContainer}>
        {data.map((item, i) => (
          <View
            key={i}
            style={styles.itemContainer}
          >
            <View style={styles.row}>
              <Image
                source={{ uri: item.avatar }}
                style={styles.image}
              />

              <View style={styles.infoContainer}>
                <Text weight="medium">{item.name}</Text>
                <Text size={12} color="#6b7280">
                  {item.lastReportDays} ימים מאז דיווח אחרון
                </Text>
              </View>
            </View>

            <View style={styles.detailsContainer}>
              <View style={styles.detailsRow}>
                <Text size={12} color="#6b7280">מצב קלורי יומי:</Text>
                <Text
                  weight="bold"
                  size={12}
                  color={item.calorieStatus < 0 ? '#dc2626' : '#16a34a'}
                >
                  {item.calorieStatus}%
                </Text>
              </View>

              <View style={styles.secondaryRow}>
                <Text size={12} color="#6b7280">אימון אחרון:</Text>
                <Text weight="bold" size={12}>
                  {item.lastWorkout}
                </Text>
              </View>
            </View>

            <View style={styles.actionsRow}>
              <Pressable style={styles.button}>
                <Text size={12} color="#2563eb" weight="medium">צ'אט</Text>
              </Pressable>
              <Pressable style={styles.button}>
                <Text size={12} color="#6b7280">פרופיל</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}