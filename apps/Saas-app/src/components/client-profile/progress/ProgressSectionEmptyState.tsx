import React, { memo } from "react";
import { Text, View } from "react-native";

import { styles } from "./styles/ProgressSectionEmptyState.styles";

type Props = {
  title: string;
  message: string;
};

const ProgressSectionEmptyState = memo(({ title, message }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
});

export default ProgressSectionEmptyState;
