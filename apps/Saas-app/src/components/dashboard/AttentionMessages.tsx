import { View, Image, Pressable } from 'react-native';
import Card from '../ui/Card';
import Text from '../ui/Text';
import { styles } from './styles/AttentionMessages.styles';

interface Message {
  name: string;
  avatar: string;
  time: string;
  message: string;
  severity: 'red' | 'yellow' | 'orange';
}

interface Props {
  data: Message[];
}

const colors = {
  red: '#fee2e2',
  yellow: '#fef9c3',
  orange: '#ffedd5',
};

export default function AttentionMessages({ data }: Props) {
  return (
    <Card>
      <View style={styles.header}>
        <Text weight="bold" size={18}>הודעות הדורשות מענה</Text>
        <Text size={12} color="#dc2626">{data.length}</Text>
      </View>

      <View style={styles.listContainer}>
        {data.map((item, i) => (
          <View
            key={i}
            style={[styles.messageContainer, { backgroundColor: colors[item.severity] }]}
          >
            <Image
              source={{ uri: item.avatar }}
              style={styles.image}
            />

            <View style={styles.content}>
              <View style={styles.contentHeader}>
                <Text weight="medium" size={14}>{item.name}</Text>
                <Text size={12} color="#6b7280">{item.time}</Text>
              </View>

              <Text size={12} color="#6b7280" style={styles.messageText}>
                {item.message}
              </Text>

              <Pressable>
                <Text size={12} color="#2563eb" weight="medium">פתח צ'אט</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </Card>
  );
}
