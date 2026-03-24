import { View, Text, Pressable } from "react-native";
import { CANONICAL_MUSCLE_GROUP_VALUES } from "@/mappers/workout/workoutEnumMapper";
import { styles } from "./styles/WorkoutFilters.styles";

type Props = {
  selectedMuscle: string;
  onChangeMuscle: (value: string) => void;
  totalCount: number;
  muscleOptions?: string[];
};

const MUSCLE_OPTIONS = [
  "הכל",
  ...CANONICAL_MUSCLE_GROUP_VALUES,
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
