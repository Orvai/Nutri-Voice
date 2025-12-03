import { Text as RNText, TextProps } from 'react-native';

interface Props extends TextProps {
  weight?: 'light' | 'regular' | 'medium' | 'bold';
  size?: number;
  color?: string;
}

export default function Text({
  weight = 'regular',
  size = 16,
  color = '#111827',
  style,
  ...rest
}: Props) {
  return (
    <RNText
      style={[
        {
          fontSize: size,
          color,
          fontFamily:
            weight === 'light'
              ? 'Heebo-Light'
              : weight === 'medium'
              ? 'Heebo-Medium'
              : weight === 'bold'
              ? 'Heebo-Bold'
              : 'Heebo-Regular',
        },
        style,
      ]}
      {...rest}
    />
  );
}
