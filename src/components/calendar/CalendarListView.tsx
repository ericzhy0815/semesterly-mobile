import { useThemeColors } from "@/hooks/useThemeColors";
import type { ThemeColors } from "@/lib/colors";
import {
  formatDayHeader,
  formatMonthYearFull,
  formatSkippedRange,
  formatTimeRange,
  fromDayString,
  toDayString,
} from "@/lib/date";
import { useCalendarStore } from "@/stores/calendarStore";
import type { FlashListRef } from "@shopify/flash-list";
import { FlashList } from "@shopify/flash-list";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type ListEvent = {
  id: string;
  title: string;
  section?: string;
  location?: string;
  start: { dateTime: string };
  end: { dateTime: string };
  color?: string;
};

type ListItem =
  | { type: "monthHeader"; monthKey: string; label: string }
  | { type: "dayHeader"; date: string; title: string }
  | { type: "skippedRange"; startDate: string; endDate: string; label: string }
  | (ListEvent & { type: "event" });

type CalendarListViewProps = {
  events: ListEvent[];
  loadedStart: Date;
  loadedEnd: Date;
  monthLabel: string;
  onMonthPress?: () => void;
  onDatePress?: (date: string) => void;
  /** Called when the visible range changes. Optional indices for extend logic. */
  onVisibleRangeChange?: (
    anchorDate: string,
    tailDate: string,
    topmostIndex?: number,
    bottommostIndex?: number,
    listLength?: number,
  ) => void;
  /** When set, scroll to this date's section (e.g. from today button). Cleared after scroll. */
  scrollToDate?: Date | null;
  /** Called after scrollToDate has been handled (scroll completed or date not in list). */
  onScrollToDateHandled?: () => void;
  onEventPress?: (event: ListEvent) => void;
};

function getDateStr(iso: string): string {
  return iso.slice(0, 10);
}

function shiftDate(dateStr: string, days: number): string {
  const d = new Date(dateStr + "T12:00:00");
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

// Extra days rendered on each side of loaded range (no fetch) for smooth scrolling.
const DISPLAY_BUFFER_DAYS = 730; // ~24 months each side

function getDateFromListItem(item: ListItem): string {
  if (item.type === "dayHeader") return item.date;
  if (item.type === "event") return getDateStr(item.start.dateTime);
  if (item.type === "monthHeader") return item.monthKey + "-01";
  if (item.type === "skippedRange") return item.startDate;
  return "";
}

export function CalendarListView({
  events,
  loadedStart,
  loadedEnd,
  monthLabel,
  onMonthPress,
  onDatePress,
  onVisibleRangeChange,
  scrollToDate,
  onScrollToDateHandled,
  onEventPress,
}: CalendarListViewProps) {
  const colors = useThemeColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const listRef = useRef<FlashListRef<ListItem>>(null);
  const lastVisibleRange = useRef<{ anchor: string; tail: string } | null>(
    null,
  );
  const getTodayDate = useCalendarStore((s) => s.getTodayDate);
  const today = toDayString(getTodayDate());

  const listData = useMemo((): ListItem[] => {
    const byDate = new Map<string, ListEvent[]>();
    for (const e of events) {
      const d = getDateStr(e.start.dateTime);
      if (!byDate.has(d)) byDate.set(d, []);
      byDate.get(d)!.push(e);
    }

    const loadedStartStr = toDayString(loadedStart);
    const loadedEndStr = toDayString(loadedEnd);
    let startDate = shiftDate(loadedStartStr, -DISPLAY_BUFFER_DAYS);
    let endDate = shiftDate(loadedEndStr, DISPLAY_BUFFER_DAYS);
    const scrollStr = scrollToDate ? toDayString(scrollToDate) : null;
    if (scrollStr) {
      if (scrollStr < startDate) startDate = scrollStr;
      if (scrollStr > endDate) endDate = scrollStr;
    }

    const shownSet = new Set<string>(byDate.keys());
    if (today >= startDate && today <= endDate) shownSet.add(today);
    const shownDates = [...shownSet].sort();

    const out: ListItem[] = [];

    function monthStart(monthKey: string): string {
      return monthKey + "-01";
    }
    function monthEnd(monthKey: string): string {
      const d = new Date(monthKey + "-01T12:00:00");
      d.setMonth(d.getMonth() + 1);
      d.setDate(0);
      return d.toISOString().slice(0, 10);
    }

    const cur = new Date(startDate + "T12:00:00");
    const end = new Date(endDate + "T12:00:00");
    for (; cur <= end; cur.setMonth(cur.getMonth() + 1), cur.setDate(1)) {
      const monthKey =
        cur.getFullYear() + "-" + String(cur.getMonth() + 1).padStart(2, "0");
      const mStart = monthStart(monthKey);
      const mEnd = monthEnd(monthKey);
      const clampStart = mStart < startDate ? startDate : mStart;
      const clampEnd = mEnd > endDate ? endDate : mEnd;

      const label = formatMonthYearFull(fromDayString(mStart));
      out.push({ type: "monthHeader", monthKey, label });

      const daysInMonth = shownDates.filter(
        (d) => d >= clampStart && d <= clampEnd,
      );
      if (daysInMonth.length === 0) {
        const label =
          clampStart === clampEnd
            ? formatDayHeader(fromDayString(clampStart))
            : formatSkippedRange(
                fromDayString(clampStart),
                fromDayString(clampEnd),
              );
        out.push({
          type: "skippedRange",
          startDate: clampStart,
          endDate: clampEnd,
          label,
        });
        continue;
      }
      let prevDay = "";
      for (const dateStr of daysInMonth) {
        if (prevDay && shiftDate(prevDay, 1) !== dateStr) {
          const gapStart = shiftDate(prevDay, 1);
          const gapEnd = shiftDate(dateStr, -1);
          const label =
            gapStart === gapEnd
              ? formatDayHeader(fromDayString(gapStart))
              : formatSkippedRange(
                  fromDayString(gapStart),
                  fromDayString(gapEnd),
                );
          out.push({
            type: "skippedRange",
            startDate: gapStart,
            endDate: gapEnd,
            label,
          });
        }
        prevDay = dateStr;
        const dayEvents = (byDate.get(dateStr) ?? []).sort(
          (a, b) =>
            new Date(a.start.dateTime).getTime() -
            new Date(b.start.dateTime).getTime(),
        );
        out.push({
          type: "dayHeader",
          date: dateStr,
          title: formatDayHeader(fromDayString(dateStr)),
        });
        for (const e of dayEvents) {
          out.push({ ...e, type: "event" });
        }
      }
    }

    return out;
  }, [events, loadedStart, loadedEnd, scrollToDate, today]);

  const stickyHeaderIndices = useMemo(() => {
    return listData
      .map((item, index) => (item.type === "monthHeader" ? index : null))
      .filter((i): i is number => i !== null);
  }, [listData]);

  // Scroll to date when requested (e.g. today button)
  useEffect(() => {
    if (!scrollToDate || listData.length === 0) return;
    const scrollStr = toDayString(scrollToDate);
    const idx = listData.findIndex(
      (item) => item.type === "dayHeader" && item.date === scrollStr,
    );
    if (idx >= 0) {
      const scroll = () => {
        listRef.current
          ?.scrollToIndex({
            index: idx,
            animated: true,
            viewPosition: 0,
          })
          ?.then(() => {
            onScrollToDateHandled?.();
          })
          ?.catch(() => onScrollToDateHandled?.());
      };
      requestAnimationFrame(() => requestAnimationFrame(scroll));
    } else {
      onScrollToDateHandled?.();
    }
  }, [scrollToDate, listData, onScrollToDateHandled]);

  const handleViewableItemsChanged = useCallback(
    (info: { viewableItems: { index: number | null; item: ListItem }[] }) => {
      const { viewableItems } = info;
      if (viewableItems.length === 0 || !onVisibleRangeChange) return;

      let topmost: { index: number; item: ListItem } | null = null;
      let bottommost: { index: number; item: ListItem } | null = null;
      for (const v of viewableItems) {
        if (v.index == null) continue;
        if (topmost == null || v.index < topmost.index) {
          topmost = { index: v.index, item: v.item };
        }
        if (bottommost == null || v.index > bottommost.index) {
          bottommost = { index: v.index, item: v.item };
        }
      }
      if (topmost != null && bottommost != null) {
        const anchorDate = getDateFromListItem(topmost.item);
        const tailDate = getDateFromListItem(bottommost.item);
        if (!anchorDate || !tailDate) return;
        if (
          lastVisibleRange.current?.anchor === anchorDate &&
          lastVisibleRange.current?.tail === tailDate
        )
          return;
        lastVisibleRange.current = { anchor: anchorDate, tail: tailDate };
        onVisibleRangeChange(
          anchorDate,
          tailDate,
          topmost.index,
          bottommost.index,
          listData.length,
        );
      }
    },
    [onVisibleRangeChange, listData.length],
  );

  const viewabilityConfig = useMemo(
    () => ({
      itemVisiblePercentThreshold: 5,
      minimumViewTime: 0, // React immediately during scroll, don't wait for settle
    }),
    [],
  );

  const keyExtractor = useCallback((item: ListItem): string => {
    if (item.type === "monthHeader") return `month-${item.monthKey}`;
    if (item.type === "dayHeader") return `day-${item.date}`;
    if (item.type === "skippedRange")
      return `skipped-${item.startDate}-${item.endDate}`;
    return item.id;
  }, []);

  const getItemType = useCallback((item: ListItem): string => {
    return item.type;
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: ListItem }) => {
      if (item.type === "monthHeader") {
        return (
          <TouchableOpacity
            style={styles.monthHeaderRow}
            onPress={onMonthPress}
            activeOpacity={0.7}
          >
            <Text style={styles.monthHeaderRowText}>{item.label}</Text>
          </TouchableOpacity>
        );
      }
      if (item.type === "dayHeader") {
        return (
          <TouchableOpacity
            style={[
              styles.sectionHeader,
              item.date === today && styles.sectionHeaderToday,
            ]}
            onPress={() => onDatePress?.(item.date)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.sectionHeaderText,
                item.date === today && styles.sectionHeaderTextToday,
              ]}
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        );
      }
      if (item.type === "skippedRange") {
        const isSingleDay = item.startDate === item.endDate;
        if (isSingleDay) {
          return (
            <View
              style={[
                styles.skippedSingleDayRow,
                item.startDate === today && styles.skippedSingleDayRowToday,
              ]}
            >
              <Text
                style={[
                  styles.sectionHeaderText,
                  item.startDate === today && styles.sectionHeaderTextToday,
                ]}
              >
                {item.label}
              </Text>
            </View>
          );
        }
        return (
          <View style={styles.skippedRow}>
            <Text style={styles.skippedRowText}>{item.label}</Text>
          </View>
        );
      }
      const eventBody = (
        <>
          <Text style={styles.eventTime}>
            {formatTimeRange(item.start.dateTime, item.end.dateTime)}
          </Text>
          <View style={styles.eventContent}>
            <Text style={styles.eventTitle} numberOfLines={2}>
              {item.title}
              {item.section ? ` (${item.section})` : ""}
            </Text>
            {item.location ? (
              <Text style={styles.eventLocation} numberOfLines={1}>
                {item.location}
              </Text>
            ) : null}
          </View>
        </>
      );
      const rowStyle = [
        styles.eventRow,
        { borderLeftColor: (item.color as string) ?? colors.buttonBg },
      ];
      if (onEventPress) {
        return (
          <TouchableOpacity
            style={rowStyle}
            onPress={() => {
              const { type: _t, ...rest } = item;
              onEventPress(rest as ListEvent);
            }}
            activeOpacity={0.7}
          >
            {eventBody}
          </TouchableOpacity>
        );
      }
      return <View style={rowStyle}>{eventBody}</View>;
    },
    [styles, today, colors.buttonBg, onDatePress, onMonthPress, onEventPress],
  );

  return (
    <View style={styles.container}>
      <FlashList
        ref={listRef}
        data={listData}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemType={getItemType}
        drawDistance={50}
        stickyHeaderIndices={stickyHeaderIndices}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        style={styles.list}
      />
    </View>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    list: {
      flex: 1,
    },
    listContent: {
      paddingBottom: 24,
    },
    monthHeaderRow: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    monthHeaderRowText: {
      fontSize: 17,
      fontWeight: "700",
      color: colors.text,
    },
    skippedSingleDayRow: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: colors.skippedDayBg,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    skippedSingleDayRowToday: {
      backgroundColor: colors.skippedDayTodayBg,
    },
    skippedRow: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      backgroundColor: colors.surfaceMuted,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    skippedRowText: {
      fontSize: 13,
      color: colors.textMuted,
    },
    sectionHeader: {
      paddingVertical: 10,
      paddingHorizontal: 16,
      backgroundColor: colors.surface,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    sectionHeaderToday: {
      backgroundColor: colors.todayContainerBg,
    },
    sectionHeaderText: {
      fontSize: 15,
      fontWeight: "600",
      color: colors.text,
    },
    sectionHeaderTextToday: {
      color: colors.text,
    },
    eventRow: {
      flexDirection: "row",
      paddingVertical: 10,
      paddingHorizontal: 16,
      borderLeftWidth: 4,
      backgroundColor: colors.background,
      gap: 12,
    },
    eventTime: {
      fontSize: 13,
      color: colors.textMuted,
      minWidth: 100,
    },
    eventContent: {
      flex: 1,
    },
    eventTitle: {
      fontSize: 15,
      fontWeight: "500",
      color: colors.text,
    },
    eventLocation: {
      fontSize: 13,
      color: colors.textMuted,
      marginTop: 2,
    },
  });
}
