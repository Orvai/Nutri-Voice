import { View } from 'react-native';
import { colors } from '../../styles/colors';

export default function Divider() {
  return <View style={{ height: 1, backgroundColor: colors.neutral200, width: '100%' }} />;
}