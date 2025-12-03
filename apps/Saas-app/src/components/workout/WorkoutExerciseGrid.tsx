import { View } from "react-native";
import WorkoutExerciseCard from "./WorkoutExerciseCard";

export default function WorkoutExerciseGrid({ exercises, onPress }) {
  return (
    <View
      style={{
        flexDirection: "row-reverse",
        flexWrap: "wrap",
        justifyContent: "space-between",
        gap: 14,
      }}
    >
      {exercises.map((ex) => (
        <View key={ex.id} style={{ width: "48%" }}>
          <WorkoutExerciseCard
            item={ex}
            onPress={() => onPress?.(ex)}  
          />
        </View>
      ))}
    </View>
  );
}
