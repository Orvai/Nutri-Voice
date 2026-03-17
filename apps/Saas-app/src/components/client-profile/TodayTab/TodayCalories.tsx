import { View, Text } from "react-native";
import { styles } from "./styles/TodayCalories.styles";

export default function TodayCalories({ data }) {
  const consumed = Number(data?.consumed ?? 0);
  const target = Number(data?.target ?? 0);
  const delta = consumed - target;
  const progress = target > 0 ? Math.max(0, Math.min(1, consumed / target)) : 0;

  const status =
    delta > 120
      ? { label: "מעל היעד", pillStyle: styles.statusDanger, fillStyle: styles.fillDanger, textColor: "#991b1b" }
      : delta < -120
      ? { label: "מתחת ליעד", pillStyle: styles.statusWarning, fillStyle: styles.fillWarning, textColor: "#92400e" }
      : { label: "בטווח היעד", pillStyle: styles.statusGood, fillStyle: styles.fillGood, textColor: "#166534" };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>קלוריות יומיות</Text>
        <View style={[styles.statusPill, status.pillStyle]}>
          <Text style={[styles.statusText, { color: status.textColor }]}>{status.label}</Text>
        </View>
      </View>

      <View style={styles.valueRow}>
        <View style={styles.valueBlock}>
          <Text style={styles.valueLabel}>נצרך</Text>
          <Text style={styles.mainValue}>{consumed.toLocaleString()}</Text>
        </View>

        <View style={styles.valueDivider} />

        <View style={styles.valueBlock}>
          <Text style={styles.valueLabel}>יעד יומי</Text>
          <Text style={styles.targetValue}>{target.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.progressTrack}>
        <View
          style={[
            styles.progressFill,
            status.fillStyle,
            { width: `${Math.round(progress * 100)}%` },
          ]}
        />
      </View>

      <Text style={styles.balanceText}>
        {delta > 0 ? "חריגה" : "נותרו"} {Math.abs(delta).toLocaleString()} קל'
      </Text>

      <View style={styles.macrosGrid}>
        <MacroRow
          label="פחמימות"
          eaten={data?.carbs?.eaten ?? 0}
          target={data?.carbs?.target ?? 0}
          color="#2563eb"
        />
        <MacroRow
          label="חלבון"
          eaten={data?.protein?.eaten ?? 0}
          target={data?.protein?.target ?? 0}
          color="#22c55e"
        />
        <MacroRow
          label="שומן"
          eaten={data?.fat?.eaten ?? 0}
          target={data?.fat?.target ?? 0}
          color="#f97316"
        />
      </View>

      <Text style={styles.footer}>
        עדכון אחרון: {data.lastUpdate}
      </Text>
    </View>
  );
}

function MacroRow({ label, eaten, target, color }) {
  const safeTarget = Number(target) || 0;
  const safeEaten = Number(eaten) || 0;
  const progress = safeTarget > 0 ? Math.max(0, Math.min(1, safeEaten / safeTarget)) : 0;

  return (
    <View style={styles.macroRow}>
      <View style={styles.macroHead}>
        <Text style={styles.macroLabel}>{label}</Text>
        <Text style={styles.macroValue}>
          {safeEaten}g / {safeTarget > 0 ? `${safeTarget}g` : "ללא יעד"}
        </Text>
      </View>

      {safeTarget > 0 ? (
        <View style={styles.macroTrack}>
          <View style={[styles.macroFill, { width: `${Math.round(progress * 100)}%`, backgroundColor: color }]} />
        </View>
      ) : null}
    </View>
  );
}
