import { ReactNode } from "react";
import { View, ViewStyle } from "react-native";
import { theme } from "../../../theme";
import { styles } from "../styles/Card.styles";

type Props = {
  children: ReactNode;
  style?: ViewStyle;
};

export function Card({ children, style }: Props) {
  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: theme.card.bg,
          borderColor: theme.card.border,
          borderRadius: theme.card.radius,
          padding: theme.card.padding,
          ...theme.shadow.base,
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}
