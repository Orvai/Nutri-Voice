import { View, Text, Pressable } from "react-native";
import { styles } from "./styles/WorkoutFilters.styles";

type Props = {
  selectedMuscle: string;
  onChangeMuscle: (value: string) => void;
  totalCount: number;
  muscleOptions?: string[];
};

const MUSCLE_OPTIONS = [
  "הכל",
  "חזה",
  "גב",
  "רגליים",
  "כתפיים",
  "יד קדמית",
  "יד אחורית",
];

export default function WorkoutFilters({
  selectedMuscle,
  onChangeMuscle,
  totalCount,
  muscleOptions,
}: Props) {
  const options = muscleOptions?.length ? muscleOptions : MUSCLE_OPTIONS;

  return (
    <View style={styles.container}>
      <View style={styles.filtersWrap}>
        {options.map((m) => {
          const active = selectedMuscle === m;
          return (
            <Pressable
              key={m}
              onPress={() => onChangeMuscle(m)}
              style={[
                styles.filterButton,
                {
                  backgroundColor: active ? "#2563eb" : "#e5e7eb",
                },
              ]}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: active ? "#fff" : "#374151",
                    fontWeight: active ? "700" : "500",
                  },
                ]}
              >
                {m}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.countText}>נמצאו {totalCount} תרגילים</Text>
    </View>
  );
}
