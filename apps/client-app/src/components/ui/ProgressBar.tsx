import { StyleSheet, View } from "react-native";
import { colors } from "@/constants/colors";
import { clampPercent } from "@/utils/format";

type ProgressBarProps = {
  progress: number;
  color?: string;
  height?: number;
};

export function ProgressBar({ progress, color = colors.neon, height = 6 }: ProgressBarProps) {
  return (
    <View style={[styles.track, { height }]}> 
      <View
        style={[
          styles.fill,
          {
            width: `${Math.round(clampPercent(progress) * 100)}%`,
            backgroundColor: color
          }
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    width: "100%",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 999,
    overflow: "hidden"
  },
  fill: {
    height: "100%",
    borderRadius: 999
  }
});
