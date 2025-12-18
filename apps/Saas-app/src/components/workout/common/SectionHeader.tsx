import { ReactNode } from "react";
import { View, Text, ViewStyle } from "react-native";
import { theme } from "../../../theme";
import { styles } from "../styles/SectionHeader.styles";

type Props = {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  style?: ViewStyle;
};

export function SectionHeader({ title, subtitle, action, style }: Props) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.title,
            { color: theme.text.title },
          ]}
        >
          {title}
        </Text>

        {subtitle ? (
          <Text
            style={[
              styles.subtitle,
              { color: theme.text.subtitle },
            ]}
          >
            {subtitle}
          </Text>
        ) : null}
      </View>

      {action}
    </View>
  );
}
