import { Text as RNText, TextProps } from 'react-native';
import { styles } from './styles/Text.styles';

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
        styles.text,
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