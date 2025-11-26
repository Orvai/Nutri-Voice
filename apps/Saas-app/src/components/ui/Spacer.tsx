import { View } from 'react-native';

export default function Spacer({ size = 8, horizontal = false }: { size?: number; horizontal?: boolean }) {
  return <View style={horizontal ? { width: size } : { height: size }} />;
}