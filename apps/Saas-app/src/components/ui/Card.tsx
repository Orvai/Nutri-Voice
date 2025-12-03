import { View, ViewStyle } from 'react-native';

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
}

export default function Card({ children, style }: Props) {
  return (
    <View
      style={[
        {
          backgroundColor: '#fff',
          padding: 16,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: '#e5e7eb',
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
