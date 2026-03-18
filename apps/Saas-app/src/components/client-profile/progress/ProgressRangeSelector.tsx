import React, { memo, useEffect, useMemo, useState } from "react";
import {
  LayoutAnimation,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  UIManager,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import {
  type ProgressRangeOption,
  type ProgressRangeValue,
} from "@/hooks/tracking/useClientProgressData";
import { styles } from "./styles/ProgressRangeSelector.styles";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

type CalendarCell = {
  iso: string;
  day: number;
  inCurrentMonth: boolean;
  isToday: boolean;
  isFuture: boolean;
};

type Props = {
  range: ProgressRangeValue;
  options: ProgressRangeOption[];
  onChange: (range: ProgressRangeValue) => void;
  availabilityLoading?: boolean;
};

const WEEKDAY_LABELS = ["ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳", "א׳"];

function toISODate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseISODate(value: string): Date {
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

function addDays(date: Date, days: number): Date {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfWeekMonday(date: Date): Date {
  const copy = new Date(date);
  const day = (copy.getDay() + 6) % 7;
  copy.setDate(copy.getDate() - day);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function normalizeRange(startDate: string, endDate: string): ProgressRangeValue {
  const asRange = (start: string, end: string): ProgressRangeValue => ({
    startDate: start as ProgressRangeValue["startDate"],
    endDate: end as ProgressRangeValue["endDate"],
  });

  return startDate <= endDate
    ? asRange(startDate, endDate)
    : asRange(endDate, startDate);
}

function diffDaysInclusive(startDate: string, endDate: string): number {
  const start = parseISODate(startDate);
  const end = parseISODate(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.floor(diff / 86400000) + 1);
}

function buildMonthGrid(cursor: Date): CalendarCell[] {
  const firstDay = startOfMonth(cursor);
  const gridStart = startOfWeekMonday(firstDay);
  const currentMonth = firstDay.getMonth();
  const todayIso = toISODate(new Date());

  return Array.from({ length: 42 }, (_, i) => {
    const dayDate = addDays(gridStart, i);
    const iso = toISODate(dayDate);

    return {
      iso,
      day: dayDate.getDate(),
      inCurrentMonth: dayDate.getMonth() === currentMonth,
      isToday: iso === todayIso,
      isFuture: iso > todayIso,
    };
  });
}

function formatDisplayDate(iso: string): string {
  return parseISODate(iso).toLocaleDateString("he-IL", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function formatMonth(cursor: Date): string {
  return cursor.toLocaleDateString("he-IL", {
    month: "long",
    year: "numeric",
  });
}

function isInRange(iso: string, start: string | null, end: string | null): boolean {
  if (!start || !end) return false;
  return iso >= start && iso <= end;
}

function isSameRange(a: ProgressRangeValue, b: ProgressRangeValue): boolean {
  return a.startDate === b.startDate && a.endDate === b.endDate;
}

const ProgressRangeSelector = memo(({ range, options, onChange, availabilityLoading = false }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cursorMonth, setCursorMonth] = useState<Date>(() => startOfMonth(parseISODate(range.endDate)));
  const [draftStart, setDraftStart] = useState<string | null>(range.startDate);
  const [draftEnd, setDraftEnd] = useState<string | null>(range.endDate);
  const todayIso = useMemo(() => toISODate(new Date()), []);
  const todayRange = useMemo(
    () =>
      ({
        startDate: todayIso as ProgressRangeValue["startDate"],
        endDate: todayIso as ProgressRangeValue["endDate"],
      }) satisfies ProgressRangeValue,
    [todayIso]
  );
  const isTodayActive = useMemo(() => isSameRange(range, todayRange), [range, todayRange]);

  const activeOption = useMemo(
    () => options.find((option) => isSameRange(option.range, range)) ?? null,
    [options, range]
  );

  const activeDays = useMemo(
    () => diffDaysInclusive(range.startDate, range.endDate),
    [range.startDate, range.endDate]
  );

  const draftDays = useMemo(() => {
    if (!draftStart) return 0;
    return diffDaysInclusive(draftStart, draftEnd || draftStart);
  }, [draftEnd, draftStart]);

  const calendarCells = useMemo(() => buildMonthGrid(cursorMonth), [cursorMonth]);

  useEffect(() => {
    if (!isModalOpen) return;

    setDraftStart(range.startDate);
    setDraftEnd(range.endDate);
    setCursorMonth(startOfMonth(parseISODate(range.endDate)));
  }, [isModalOpen, range.endDate, range.startDate]);

  const applyRange = (nextRange: ProgressRangeValue) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onChange(nextRange);
  };

  const onSelectPreset = (option: ProgressRangeOption) => {
    if (!option.isAvailable) return;

    applyRange(option.range);
    setIsModalOpen(false);
  };

  const onSelectToday = () => {
    applyRange(todayRange);
    setIsModalOpen(false);
  };

  const onSelectCustomDay = (iso: string) => {
    if (iso > todayIso) return;

    if (!draftStart || (draftStart && draftEnd)) {
      setDraftStart(iso);
      setDraftEnd(null);
      return;
    }

    if (iso < draftStart) {
      setDraftEnd(draftStart);
      setDraftStart(iso);
      return;
    }

    setDraftEnd(iso);
  };

  const moveMonth = (delta: number) => {
    setCursorMonth((prev) => {
      const next = new Date(prev.getFullYear(), prev.getMonth() + delta, 1);
      const nowMonth = startOfMonth(new Date());

      if (next > nowMonth) return nowMonth;
      return next;
    });
  };

  const onApplyCustom = () => {
    if (!draftStart) return;

    const normalized = normalizeRange(draftStart, draftEnd || draftStart);
    applyRange(normalized);
    setIsModalOpen(false);
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        <View style={styles.infoSection}>
          <Text style={styles.label}>תקופת ניתוח</Text>
          <Text style={styles.dateRange}>
            {formatDisplayDate(range.startDate)} - {formatDisplayDate(range.endDate)}
          </Text>
          <Text style={styles.miniNote}>{activeDays} ימים</Text>
        </View>

        <Pressable style={styles.calendarBtn} onPress={() => setIsModalOpen(true)}>
          <Ionicons name="calendar-clear-outline" size={16} color="#1d4ed8" />
          <Text style={styles.calendarBtnText}>בחירה</Text>
        </Pressable>
      </View>

      <View style={styles.presetsRow}>
        <Pressable
          style={[styles.presetBtn, isTodayActive && styles.activePresetBtn]}
          onPress={onSelectToday}
        >
          <Text style={[styles.presetText, isTodayActive && styles.activePresetText]}>היום</Text>
        </Pressable>

        <Pressable
          style={[styles.presetBtn, !activeOption && !isTodayActive && styles.activePresetBtn]}
          onPress={() => setIsModalOpen(true)}
        >
          <Text style={[styles.presetText, !activeOption && !isTodayActive && styles.activePresetText]}>טווח מותאם</Text>
        </Pressable>

        {options.map((option) => {
          const isActive = !!activeOption && activeOption.key === option.key;
          const isDisabled = !option.isAvailable;

          return (
            <Pressable
              key={option.key}
              style={[
                styles.presetBtn,
                isActive && styles.activePresetBtn,
                isDisabled && styles.disabledPresetBtn,
              ]}
              onPress={() => onSelectPreset(option)}
              disabled={isDisabled}
            >
              <Text
                style={[
                  styles.presetText,
                  isActive && styles.activePresetText,
                  isDisabled && styles.disabledPresetText,
                ]}
              >
                {option.label}
              </Text>
              {isDisabled ? <Text style={styles.unavailableText}>אין נתונים</Text> : null}
            </Pressable>
          );
        })}
      </View>

      {availabilityLoading ? <Text style={styles.availabilityText}>בודק זמינות טווחים...</Text> : null}

      <Modal
        visible={isModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
            <ScrollView
              style={styles.modalScroll}
              contentContainerStyle={styles.modalScrollContent}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>בחירת טווח תאריכים</Text>
                <Pressable style={styles.closeBtn} onPress={() => setIsModalOpen(false)}>
                  <Text style={styles.closeBtnText}>סגור</Text>
                </Pressable>
              </View>

              <View>
                <Text style={styles.modalRangeText}>
                  {draftStart
                    ? `${formatDisplayDate(draftStart)} - ${formatDisplayDate(draftEnd || draftStart)}`
                    : "בחר תאריך התחלה"}
                </Text>
                <Text style={styles.modalRangeSub}>
                  {draftDays > 0 ? `${draftDays} ימים בטווח` : "בחר התחלה וסיום"}
                </Text>
              </View>

              <View style={styles.modalPresetRow}>
                <Pressable
                  style={[styles.modalPresetBtn, isTodayActive && styles.modalPresetBtnActive]}
                  onPress={onSelectToday}
                >
                  <Text style={[styles.modalPresetText, isTodayActive && styles.modalPresetTextActive]}>היום</Text>
                </Pressable>

                {options.map((option) => {
                  const isActive = Math.abs(draftDays - option.days) <= 1 && option.isAvailable;
                  const isDisabled = !option.isAvailable;

                  return (
                    <Pressable
                      key={`modal-${option.key}`}
                      style={[
                        styles.modalPresetBtn,
                        isActive && styles.modalPresetBtnActive,
                        isDisabled && styles.modalPresetBtnDisabled,
                      ]}
                      onPress={() => onSelectPreset(option)}
                      disabled={isDisabled}
                    >
                      <Text
                        style={[
                          styles.modalPresetText,
                          isActive && styles.modalPresetTextActive,
                          isDisabled && styles.modalPresetTextDisabled,
                        ]}
                      >
                        {option.label}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.monthHeader}>
                <Pressable style={styles.monthArrow} onPress={() => moveMonth(1)}>
                  <Ionicons name="chevron-forward" size={16} color="#0f172a" />
                </Pressable>
                <Text style={styles.monthLabel}>{formatMonth(cursorMonth)}</Text>
                <Pressable style={styles.monthArrow} onPress={() => moveMonth(-1)}>
                  <Ionicons name="chevron-back" size={16} color="#0f172a" />
                </Pressable>
              </View>

              <View style={styles.weekdaysRow}>
                {WEEKDAY_LABELS.map((dayLabel) => (
                  <View key={dayLabel} style={styles.weekdayCell}>
                    <Text style={styles.weekdayText}>{dayLabel}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.monthGrid}>
                {calendarCells.map((cell) => {
                  const start = draftStart;
                  const end = draftEnd || draftStart;
                  const selected = !!start && (cell.iso === start || (!!end && cell.iso === end));
                  const inRange = isInRange(cell.iso, start, end);

                  return (
                    <Pressable
                      key={cell.iso}
                      style={[
                        styles.dayCell,
                        !cell.inCurrentMonth && styles.dayCellOutside,
                        inRange && styles.dayCellInRange,
                        cell.isToday && !selected && styles.dayCellToday,
                        selected && styles.dayCellSelected,
                        cell.isFuture && styles.dayCellDisabled,
                      ]}
                      onPress={() => onSelectCustomDay(cell.iso)}
                      disabled={cell.isFuture}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          !cell.inCurrentMonth && styles.dayTextOutside,
                          selected && styles.dayTextSelected,
                          cell.isFuture && styles.dayTextDisabled,
                        ]}
                      >
                        {cell.day}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>

              <View style={styles.footer}>
                <Pressable style={styles.footerSecondary} onPress={() => setIsModalOpen(false)}>
                  <Text style={styles.footerSecondaryText}>ביטול</Text>
                </Pressable>
                <Pressable
                  style={[styles.footerPrimary, !draftStart && styles.footerPrimaryDisabled]}
                  onPress={onApplyCustom}
                  disabled={!draftStart}
                >
                  <Text style={styles.footerPrimaryText}>החלה</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
});

export default ProgressRangeSelector;
