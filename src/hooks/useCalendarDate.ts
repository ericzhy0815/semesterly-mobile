import { addDays, fromDayString, toDayString } from "@/lib/date";
import {
  useCalendarStore,
  type CalendarViewMode,
} from "@/stores/calendarStore";
import type { CalendarKitHandle } from "@howljs/calendar-kit";
import { useCallback, useEffect, useRef } from "react";

const MS_PER_DAY = 86_400_000;

// 3-day view: extend when within this many days of loaded edge
const THREE_DAY_EXTEND_THRESHOLD = 30;
const THREE_DAY_EXTEND = 30;

// List view
const LIST_EXTEND_DAYS = 360;
const LIST_INITIAL_ITEMS = 500;
const LIST_EXTEND_ITEMS_THRESHOLD = 20;

export function useCalendarDate() {
  const viewMode = useCalendarStore((s) => s.calendarView);
  const visibleDate = useCalendarStore((s) => s.visibleDate);
  const listTopmostIndex = useCalendarStore((s) => s.listTopmostIndex);
  const listBottommostIndex = useCalendarStore((s) => s.listBottommostIndex);
  const listLength = useCalendarStore((s) => s.listLength);
  const storeSetVisibleDate = useCalendarStore((s) => s.setVisibleDate);
  const calendarRef = useRef<CalendarKitHandle>(null);
  const prevViewModeRef = useRef<CalendarViewMode | null>(null);

  // 3-day load logic
  useEffect(() => {
    if (viewMode !== "3day") return;

    const { loadedStart, loadedEnd, loadEvents } = useCalendarStore.getState();
    const daysFromStart =
      (visibleDate.getTime() - loadedStart.getTime()) / MS_PER_DAY;
    const daysFromEnd =
      (loadedEnd.getTime() - visibleDate.getTime()) / MS_PER_DAY;

    if (daysFromEnd < THREE_DAY_EXTEND_THRESHOLD) {
      loadEvents(loadedStart, addDays(loadedEnd, THREE_DAY_EXTEND - 1));
    } else if (daysFromStart < THREE_DAY_EXTEND_THRESHOLD) {
      loadEvents(
        addDays(loadedStart, -THREE_DAY_EXTEND),
        addDays(loadedEnd, -1),
      );
    }
  }, [visibleDate, viewMode]);

  // List load logic: use item indices when available, else fall back to days
  useEffect(() => {
    if (viewMode !== "list") return;

    const prevView = prevViewModeRef.current;
    prevViewModeRef.current = viewMode;

    const { loadedStart, loadedEnd, loadEvents } = useCalendarStore.getState();

    if (prevView !== "list") {
      const inRange = visibleDate >= loadedStart && visibleDate < loadedEnd;
      if (!inRange) loadEvents(visibleDate, LIST_INITIAL_ITEMS);
      return;
    }
    if (listLength === 0) return;

    const itemsFromStart = listTopmostIndex;
    const itemsFromEnd = listLength - 1 - listBottommostIndex;
    const nearStart = itemsFromStart < LIST_EXTEND_ITEMS_THRESHOLD;
    const nearEnd = itemsFromEnd < LIST_EXTEND_ITEMS_THRESHOLD;

    if (nearEnd) {
      loadEvents(loadedStart, addDays(loadedEnd, LIST_EXTEND_DAYS - 1));
    } else if (nearStart) {
      loadEvents(
        addDays(loadedStart, -LIST_EXTEND_DAYS),
        addDays(loadedEnd, -1),
      );
    }
  }, [
    visibleDate,
    viewMode,
    listTopmostIndex,
    listBottommostIndex,
    listLength,
  ]);

  const onDateChanged = useCallback(
    (date: string) => {
      storeSetVisibleDate(fromDayString(date.slice(0, 10)));
    },
    [storeSetVisibleDate],
  );

  const setVisibleDate = useCallback(
    (date: Date) => {
      storeSetVisibleDate(date);
      calendarRef.current?.goToDate?.({ date: toDayString(date) });
    },
    [storeSetVisibleDate],
  );

  return {
    visibleDate,
    setVisibleDate,
    calendarRef,
    onDateChanged,
  };
}
