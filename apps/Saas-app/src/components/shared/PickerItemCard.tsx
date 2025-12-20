import React from "react";
import { Pressable, Text, View } from "react-native";
import { styles } from "./styles/PickerItemCard.styles";

export type PickerItemCardProps = {
  title: string;
  subtitle?: string;
  onPress: () => void;
  selected?: boolean;
};

export default function PickerItemCard({
  title,
  subtitle,
  onPress,
  selected = false,
}: PickerItemCardProps) {
  return (
    <View
      style={[
        styles.container,
        selected ? styles.containerSelected : styles.containerUnselected,
      ]}
    >
      <View style={styles.row}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.text}>{subtitle}</Text> : null}
      </View>

      <Pressable onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>בחר</Text>
      </Pressable>
    </View>
  );
}
