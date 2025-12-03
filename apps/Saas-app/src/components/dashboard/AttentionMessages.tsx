import { View, Image, Pressable } from 'react-native';
import Card from '../ui/Card';
import Text from '../ui/Text';

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
      <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
        <Text weight="bold" size={18}>הודעות הדורשות מענה</Text>
        <Text size={12} color="#dc2626">{data.length}</Text>
      </View>

      <View style={{ marginTop: 12, gap: 12 }}>
        {data.map((item, i) => (
          <View
            key={i}
            style={{
              padding: 12,
              borderRadius: 10,
              backgroundColor: colors[item.severity],
              flexDirection: 'row-reverse',
              gap: 12,
              alignItems: 'flex-start',
            }}
          >
            <Image
              source={{ uri: item.avatar }}
              style={{ width: 40, height: 40, borderRadius: 20 }}
            />

            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between' }}>
                <Text weight="medium" size={14}>{item.name}</Text>
                <Text size={12} color="#6b7280">{item.time}</Text>
              </View>

              <Text size={12} color="#6b7280" style={{ marginVertical: 4 }}>
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
