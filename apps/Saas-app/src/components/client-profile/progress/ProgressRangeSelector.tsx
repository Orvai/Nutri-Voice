// src/components/analytics/ProgressRangeSelector.tsx
import React, { memo, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Modal,
  ScrollView,
} from "react-native";
import { styles, ITEM_H, WHEEL_PADDING_ITEMS } from "./styles/ProgressRangeSelector.styles";
import type { DateRange, ISODate } from "@/types/ui/tracking/coach-analytics.ui";

// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type RangeValue = Pick<DateRange, "startDate" | "endDate">;

type Unit = "days" | "weeks" | "months";

type Props = {
  range: RangeValue;
  onChange: (range: RangeValue) => void;
};

const PRESETS = [
  { days: 7, label: "שבוע" },
  { days: 30, label: "חודש" },
  { days: 90, label: "3 חודשים" },
] as const;

function toISODate(d: Date): ISODate {
  return d.toISOString().slice(0, 10) as ISODate;
}

function diffDaysInclusive(start: string, end: string): number {
  const s = new Date(start);
  const e = new Date(end);
  const ms = e.getTime() - s.getTime();
  return Math.round(ms / (1000 * 3600 * 24)) + 1;
}

function fmtRange(range: RangeValue) {
  return `${range.startDate} — ${range.endDate}`;
}

function unitLabel(unit: Unit, amount: number) {
  if (unit === "days") return amount === 1 ? "יום" : "ימים";
  if (unit === "weeks") return amount === 1 ? "שבוע" : "שבועות";
  return amount === 1 ? "חודש" : "חודשים";
}

function buildRangeFromPicker(unit: Unit, amount: number): RangeValue {
  const end = new Date();
  const start = new Date(end);

  // Inclusive range: "amount" includes today as day 1.
  if (unit === "days") {
    start.setDate(end.getDate() - (amount - 1));
  } else if (unit === "weeks") {
    start.setDate(end.getDate() - (amount * 7 - 1));
  } else {
    // Calendar month subtraction; keep an inclusive feel by adding 1 day
    start.setMonth(end.getMonth() - amount);
    start.setDate(start.getDate() + 1);
  }

  return { startDate: toISODate(start), endDate: toISODate(end) };
}

function closestPresetDays(inclusiveDays: number) {
  const options = [7, 30, 90];
  let best = options[0];
  let bestDist = Math.abs(inclusiveDays - best);
  for (const d of options) {
    const dist = Math.abs(inclusiveDays - d);
    if (dist < bestDist) {
      best = d;
      bestDist = dist;
    }
  }
  return bestDist <= 1 ? best : null;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function computeInitialPickerFromRange(range: RangeValue): { unit: Unit; amount: number } {
  const days = diffDaysInclusive(range.startDate, range.endDate);

  // Heuristic: months for 60+ days, weeks for 14+ days, else days
  if (days >= 60) {
    return { unit: "months", amount: clamp(Math.round(days / 30), 1, 12) };
  }
  if (days >= 14) {
    return { unit: "weeks", amount: clamp(Math.round(days / 7), 1, 12) };
  }
  return { unit: "days", amount: clamp(days, 1, 31) };
}

function wheelIndexFromOffset(y: number) {
  return Math.round(y / ITEM_H);
}

function wheelOffsetFromIndex(i: number) {
  return i * ITEM_H;
}

const ProgressRangeSelector = memo(({ range, onChange }: Props) => {
  const activeDays = useMemo(
    () => diffDaysInclusive(range.startDate, range.endDate),
    [range.startDate, range.endDate]
  );
  const activePreset = useMemo(() => closestPresetDays(activeDays), [activeDays]);

  const [modalOpen, setModalOpen] = useState(false);

  // Picker state
  const initial = useMemo(() => computeInitialPickerFromRange(range), [range.startDate, range.endDate]);
  const [unit, setUnit] = useState<Unit>(initial.unit);
  const [amount, setAmount] = useState<number>(initial.amount);

  // Wheels
  const amountRef = useRef<ScrollView>(null);
  const unitRef = useRef<ScrollView>(null);

  const unitOptions = useMemo(
    () => [
      { key: "days" as Unit, label: "ימים" },
      { key: "weeks" as Unit, label: "שבועות" },
      { key: "months" as Unit, label: "חודשים" },
    ],
    []
  );

  const amountOptions = useMemo(() => {
    if (unit === "days") return Array.from({ length: 31 }, (_, i) => i + 1);
    return Array.from({ length: 12 }, (_, i) => i + 1);
  }, [unit]);

  const previewRange = useMemo(() => buildRangeFromPicker(unit, amount), [unit, amount]);

  useEffect(() => {
    if (!modalOpen) return;

    const next = computeInitialPickerFromRange(range);
    setUnit(next.unit);
    setAmount(next.amount);

    requestAnimationFrame(() => {
      const unitIndex = unitOptions.findIndex((u) => u.key === next.unit);
      unitRef.current?.scrollTo({ y: wheelOffsetFromIndex(Math.max(0, unitIndex)), animated: false });

      const amountIndex = Math.max(0, next.amount - 1);
      amountRef.current?.scrollTo({ y: wheelOffsetFromIndex(amountIndex), animated: false });
    });
  }, [modalOpen, range.startDate, range.endDate, unitOptions]);

  const setPreset = (days: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - (days - 1));

    onChange({
      startDate: toISODate(start),
      endDate: toISODate(end),
    });
  };

  const onApply = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onChange(previewRange);
    setModalOpen(false);
  };

  return (
    <View style={styles.outerContainer}>
      {/* Presets */}
      <View style={styles.presetsRow}>
        {PRESETS.map((p) => {
          const isActive = activePreset === p.days;
          return (
            <TouchableOpacity
              key={p.days}
              style={[styles.presetBtn, isActive && styles.activePresetBtn]}
              onPress={() => setPreset(p.days)}
              activeOpacity={0.85}
            >
              <Text style={[styles.presetText, isActive && styles.activePresetText]}>{p.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Current Range */}
      <View style={styles.container}>
        <View style={styles.infoSection}>
          <Text style={styles.label}>תקופת ניתוח</Text>
          <Text style={styles.dateRange}>{fmtRange(range)}</Text>
          <Text style={styles.miniNote}>{activeDays} ימים</Text>
        </View>

        <TouchableOpacity style={styles.editBtn} onPress={() => setModalOpen(true)} activeOpacity={0.85}>
          <Text style={styles.editBtnText}>בחירה</Text>
        </TouchableOpacity>
      </View>

      {/* Modal Picker */}
      <Modal visible={modalOpen} transparent animationType="fade" onRequestClose={() => setModalOpen(false)}>
        <View style={styles.modalBackdrop}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>בחר תקופה</Text>
              <TouchableOpacity onPress={() => setModalOpen(false)} activeOpacity={0.85}>
                <Text style={styles.modalClose}>סגור</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.modalSub}>
              תקופה: {amount} {unitLabel(unit, amount)}
            </Text>
            <Text style={styles.modalPreview}>{fmtRange(previewRange)}</Text>

            <View style={styles.wheelsRow}>
              {/* Amount wheel */}
              <View style={styles.wheelWrap}>
                <Text style={styles.wheelLabel}>כמות</Text>

                <View style={styles.wheelFrame}>
                  <View style={styles.wheelHighlight} />

                  <ScrollView
                    ref={amountRef}
                    showsVerticalScrollIndicator={false}
                    decelerationRate="fast"
                    snapToInterval={ITEM_H}
                    contentContainerStyle={styles.wheelContent}
                    onMomentumScrollEnd={(e) => {
                      const idx = wheelIndexFromOffset(e.nativeEvent.contentOffset.y);
                      const clamped = clamp(idx, 0, amountOptions.length - 1);
                      setAmount(amountOptions[clamped]);
                      amountRef.current?.scrollTo({ y: wheelOffsetFromIndex(clamped), animated: true });
                    }}
                  >
                    {Array.from({ length: WHEEL_PADDING_ITEMS }).map((_, i) => (
                      <View key={`ap-top-${i}`} style={{ height: ITEM_H }} />
                    ))}

                    {amountOptions.map((n) => (
                      <View key={`amt-${n}`} style={styles.wheelItem}>
                        <Text style={styles.wheelItemText}>{n}</Text>
                      </View>
                    ))}

                    {Array.from({ length: WHEEL_PADDING_ITEMS }).map((_, i) => (
                      <View key={`ap-bot-${i}`} style={{ height: ITEM_H }} />
                    ))}
                  </ScrollView>
                </View>
              </View>

              {/* Unit wheel */}
              <View style={styles.wheelWrap}>
                <Text style={styles.wheelLabel}>יחידה</Text>

                <View style={styles.wheelFrame}>
                  <View style={styles.wheelHighlight} />

                  <ScrollView
                    ref={unitRef}
                    showsVerticalScrollIndicator={false}
                    decelerationRate="fast"
                    snapToInterval={ITEM_H}
                    contentContainerStyle={styles.wheelContent}
                    onMomentumScrollEnd={(e) => {
                      const idx = wheelIndexFromOffset(e.nativeEvent.contentOffset.y);
                      const clamped = clamp(idx, 0, unitOptions.length - 1);
                      const nextUnit = unitOptions[clamped].key;
                      setUnit(nextUnit);

                      requestAnimationFrame(() => {
                        // Clamp amount when switching units
                        const maxAllowed = nextUnit === "days" ? 31 : 12;
                        if (amount > maxAllowed) setAmount(maxAllowed);
                      });

                      unitRef.current?.scrollTo({ y: wheelOffsetFromIndex(clamped), animated: true });
                    }}
                  >
                    {Array.from({ length: WHEEL_PADDING_ITEMS }).map((_, i) => (
                      <View key={`up-top-${i}`} style={{ height: ITEM_H }} />
                    ))}

                    {unitOptions.map((u) => (
                      <View key={`unit-${u.key}`} style={styles.wheelItem}>
                        <Text style={styles.wheelItemText}>{u.label}</Text>
                      </View>
                    ))}

                    {Array.from({ length: WHEEL_PADDING_ITEMS }).map((_, i) => (
                      <View key={`up-bot-${i}`} style={{ height: ITEM_H }} />
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>

            <View style={styles.modalFooter}>
              <TouchableOpacity style={styles.secondaryBtn} onPress={() => setModalOpen(false)} activeOpacity={0.85}>
                <Text style={styles.secondaryBtnText}>ביטול</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.primaryBtn} onPress={onApply} activeOpacity={0.85}>
                <Text style={styles.primaryBtnText}>החלה</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
});

export default ProgressRangeSelector;
