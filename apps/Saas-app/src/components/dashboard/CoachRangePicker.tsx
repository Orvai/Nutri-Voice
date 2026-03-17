import React, { memo, useEffect, useMemo, useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { styles } from "./styles/CoachRangePicker.styles";
import type { DateRangeValue } from "./types";

type Props = {
  range: DateRangeValue;
  onChange: (value: DateRangeValue) => void;
};

type CalendarCell = {
  iso: string;
  day: number;
  inCurrentMonth: boolean;
  isToday: boolean;
};

const WEEKDAY_LABELS = ["ב׳", "ג׳", "ד׳", "ה׳", "ו׳", "ש׳", "א׳"];
const QUICK_RANGES = [
  { label: "7 ימים", days: 7 },
  { label: "14 ימים", days: 14 },
  { label: "30 ימים", days: 30 },
  { label: "90 ימים", days: 90 },
] as const;

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

function diffDaysInclusive(startDate: string, endDate: string): number {
  const start = parseISODate(startDate);
  const end = parseISODate(endDate);
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.floor(diff / 86400000) + 1);
}

function normalizeRange(startDate: string, endDate: string): DateRangeValue {
  return startDate <= endDate
    ? { startDate, endDate }
    : { startDate: endDate, endDate: startDate };
}

function buildMonthGrid(cursor: Date): CalendarCell[] {
  const firstDay = startOfMonth(cursor);
  const gridStart = startOfWeekMonday(firstDay);
  const currentMonth = firstDay.getMonth();
  const todayIso = toISODate(new Date());

  return Array.from({ length: 42 }, (_, i) => {
    const dayDate = addDays(gridStart, i);
    return {
      iso: toISODate(dayDate),
      day: dayDate.getDate(),
      inCurrentMonth: dayDate.getMonth() === currentMonth,
      isToday: toISODate(dayDate) === todayIso,
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

function rangeFromToday(days: number): DateRangeValue {
  const end = new Date();
  const start = addDays(end, -(days - 1));
  return {
    startDate: toISODate(start),
    endDate: toISODate(end),
  };
}

function isInRange(iso: string, start: string | null, end: string | null): boolean {
  if (!start || !end) return false;
  return iso >= start && iso <= end;
}

function pickActivePreset(days: number): number | null {
  const matched = QUICK_RANGES.find((item) => Math.abs(item.days - days) <= 1);
  return matched?.days ?? null;
}

const CoachRangePicker = memo(({ range, onChange }: Props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cursorMonth, setCursorMonth] = useState<Date>(() => startOfMonth(parseISODate(range.endDate)));
  const [draftStart, setDraftStart] = useState<string | null>(range.startDate);
  const [draftEnd, setDraftEnd] = useState<string | null>(range.endDate);

  const activeDays = useMemo(
    () => diffDaysInclusive(range.startDate, range.endDate),
    [range.startDate, range.endDate]
  );
  const activePreset = useMemo(() => pickActivePreset(activeDays), [activeDays]);

  const draftDays = useMemo(() => {
    if (!draftStart) return 0;
    return diffDaysInclusive(draftStart, draftEnd || draftStart);
  }, [draftStart, draftEnd]);

  const calendarCells = useMemo(() => buildMonthGrid(cursorMonth), [cursorMonth]);

  useEffect(() => {
    if (!isModalOpen) return;
    setDraftStart(range.startDate);
    setDraftEnd(range.endDate);
    setCursorMonth(startOfMonth(parseISODate(range.endDate)));
  }, [isModalOpen, range.endDate, range.startDate]);

  const applyQuickRange = (days: number) => {
    onChange(rangeFromToday(days));
    setIsModalOpen(false);
  };

  const selectDay = (iso: string) => {
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
    setCursorMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };

  const onApply = () => {
    if (!draftStart) return;
    const next = normalizeRange(draftStart, draftEnd || draftStart);
    onChange(next);
    setIsModalOpen(false);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.topRow}>
        <View style={styles.labelWrap}>
          <Text style={styles.label}>תקופת ניתוח</Text>
          <Text style={styles.value}>
            {formatDisplayDate(range.startDate)} - {formatDisplayDate(range.endDate)}
          </Text>
          <Text style={styles.valueMeta}>{activeDays} ימים</Text>
        </View>

        <Pressable style={styles.calendarBtn} onPress={() => setIsModalOpen(true)}>
          <Ionicons name="calendar-clear-outline" size={16} color="#1e3a8a" />
          <Text style={styles.calendarBtnText}>לוח שנה</Text>
        </Pressable>
      </View>

      <View style={styles.quickRow}>
        {QUICK_RANGES.map((item) => {
          const isActive = activePreset === item.days;
          return (
            <Pressable
              key={item.days}
              style={[styles.quickBtn, isActive && styles.quickBtnActive]}
              onPress={() => applyQuickRange(item.days)}
            >
              <Text style={[styles.quickBtnText, isActive && styles.quickBtnTextActive]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Modal
        visible={isModalOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View style={styles.backdrop}>
          <View style={styles.modalCard}>
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

            <View style={styles.quickRow}>
              {QUICK_RANGES.map((item) => {
                const isActive = draftDays > 0 && Math.abs(draftDays - item.days) <= 1;
                return (
                  <Pressable
                    key={`modal-${item.days}`}
                    style={[styles.quickBtn, isActive && styles.quickBtnActive]}
                    onPress={() => applyQuickRange(item.days)}
                  >
                    <Text style={[styles.quickBtnText, isActive && styles.quickBtnTextActive]}>
                      {item.label}
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
              {WEEKDAY_LABELS.map((label) => (
                <View key={label} style={styles.weekdayCell}>
                  <Text style={styles.weekdayText}>{label}</Text>
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
                    ]}
                    onPress={() => selectDay(cell.iso)}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        !cell.inCurrentMonth && styles.dayTextOutside,
                        selected && styles.dayTextSelected,
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
                onPress={onApply}
                disabled={!draftStart}
              >
                <Text style={styles.footerPrimaryText}>החלה</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
});

export default CoachRangePicker;
