import { useLocalSearchParams } from 'expo-router';
import Text from '../../src/components/ui/Text';

export default function ClientProfile() {
  const { id } = useLocalSearchParams();

  return <Text>פרופיל של לקוח {id}</Text>;
}
