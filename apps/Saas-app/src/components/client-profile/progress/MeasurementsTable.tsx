import { View, Text } from "react-native";
import { useClientProgress } from "../../../hooks/useClientProgress";
import { styles } from "./MeasurementsTable.styles";

export default function MeasurementsTable() {
  const { data } = useClientProgress();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>מדידות גוף</Text>

      {data.measurements.map((row, idx) => (
        <View
          key={idx}
          style={[
            styles.row,
            idx !== data.measurements.length - 1 && styles.rowBorder,
          ]}
        >
          <Text style={styles.strong}>{row.date}</Text>
          <Text>משקל: {row.weight} ק״ג</Text>
          <Text>אחוז שומן: {row.fat}</Text>
          <Text>מסת שריר: {row.muscle} ק״ג</Text>
          <Text>היקף מותניים: {row.waist} ס״מ</Text>
          <Text>חזה: {row.chest} ס״מ</Text>
        </View>
      ))}
    </View>
  );
}
