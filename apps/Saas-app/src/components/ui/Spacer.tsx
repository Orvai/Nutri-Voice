import { View } from 'react-native';
import { styles } from './styles/Spacer.styles';

export default function Spacer({ h = 0, w = 0 }) {
  return <View style={[styles.container, { height: h, width: w }]} />;
}