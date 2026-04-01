import { useThemeColors } from "@/hooks/useThemeColors";
import type { ThemeColors } from "@/lib/colors";
import {
  formatMonthYear,
  fromDayString,
  monthShortFromDate,
  toDayString,
} from "@/lib/date";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import type {
  CalendarKitHandle,
  DeepPartial,
  EventItem,
  OnEventResponse,
  PackedEvent,
  SizeAnimation,
  ThemeConfigs,
} from "@howljs/calendar-kit";
import {
  CalendarBody,
  CalendarContainer,
  CalendarHeader,
} from "@howljs/calendar-kit";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  Animated as RNAnimated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";
import { AddEventFormModal } from "./AddEventFormModal";
import type { ListEvent } from "./CalendarListView";
import { CalendarListView } from "./CalendarListView";
import {
  CourseDetailModal,
  payloadFromCalendarPress,
  payloadFromListEvent,
  type CourseDetailPayload,
} from "./CourseDetailModal";
import { DatePickerModal } from "./DatePickerModal";

function buildCalendarTheme(colors: ThemeColors): DeepPartial<ThemeConfigs> {
  return {
    colors: {
      primary: colors.textMuted,
      onPrimary: colors.surface,
      background: colors.background,
      onBackground: colors.text,
      border: colors.border,
      text: colors.text,
      surface: colors.surface,
      onSurface: colors.text,
    },
    hourBackgroundColor: colors.background,
    hourBorderColor: colors.border,
    hourTextStyle: { color: colors.textMuted },
    headerBackgroundColor: colors.surface,
    headerBorderColor: colors.border,
    dayBarContainer: { backgroundColor: colors.surface },
    dayBarBorderColor: colors.border,
    dayName: { color: colors.textMuted },
    dayNumber: { color: colors.text },
    todayNumber: { color: colors.text },
    todayName: { color: colors.text },
    todayNumberContainer: {
      backgroundColor: colors.todayContainerBg,
    },
    nowIndicatorColor: colors.textMuted,
    outOfRangeBackgroundColor: colors.surfaceMuted,
    unavailableHourBackgroundColor: colors.surfaceMuted,
    eventContainerStyle: { backgroundColor: colors.buttonBg },
    eventTitleStyle: { color: colors.text },
  };
}

export const CALENDAR_PAGES_PER_SIDE = 20;

const ADD_EVENT_SHEET_INITIAL_OFFSET = Dimensions.get("window").height;
const ADD_EVENT_SHEET_SLIDE_MS = 280;

function getDateOffset(years: number): string {
  const d = new Date();
  d.setFullYear(d.getFullYear() + years);
  return d.toISOString().slice(0, 10);
}

export type CalendarMainRef = {
  /** Move 3-day + list views to the first day of the selected semester. */
  goToSemesterStart: (startDateIso: string) => void;
};

type CalendarMainProps = {
  viewMode: "3day" | "list";
  calendarRef: React.RefObject<CalendarKitHandle | null>;
  onDateChanged: (date: string) => void;
  onDateSelect: (date: string) => void;
  visibleDate: Date;
  loadedStart: Date;
  loadedEnd: Date;
  onVisibleRangeChange?: (anchorDate: string, tailDate: string) => void;
  scrollToDate?: Date | null;
  onScrollToDateHandled?: () => void;
  events?: EventItem[];
  /** Updates shared visible date and list scroll (e.g. after semester change). */
  onNavigateToDate: (date: Date) => void;
};

export const CalendarMain = memo(
  forwardRef<CalendarMainRef, CalendarMainProps>(function CalendarMain(
    {
      viewMode,
      calendarRef,
      onDateChanged,
      onDateSelect,
      visibleDate,
      loadedStart,
      loadedEnd,
      onVisibleRangeChange,
      scrollToDate,
      onScrollToDateHandled,
      events = [],
      onNavigateToDate,
    },
    ref,
  ) {
    useImperativeHandle(
      ref,
      () => ({
        goToSemesterStart: (startDateIso: string) => {
          onNavigateToDate(fromDayString(startDateIso.slice(0, 10)));
        },
      }),
      [onNavigateToDate],
    );

    const colors = useThemeColors();
    const insets = useSafeAreaInsets();
    const theme = useMemo(() => buildCalendarTheme(colors), [colors]);
    const [pickerVisible, setPickerVisible] = useState(false);
    const [courseDetail, setCourseDetail] =
      useState<CourseDetailPayload | null>(null);
    const [addEventModalMounted, setAddEventModalMounted] = useState(false);
    const addEventBackdropOpacityRef = useRef(new RNAnimated.Value(0));
    const addEventSheetTranslateY = useSharedValue(
      ADD_EVENT_SHEET_INITIAL_OFFSET,
    );
    const addEventSheetAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: addEventSheetTranslateY.value }],
    }));

    /** `true` = enter (fade in + slide up); `false` = exit then unmount modal. */
    const animateAddEventModal = useCallback((open: boolean) => {
      const o = addEventBackdropOpacityRef.current;
      if (open) {
        o.setValue(0);
        addEventSheetTranslateY.value = ADD_EVENT_SHEET_INITIAL_OFFSET;
        RNAnimated.timing(o, {
          toValue: 1,
          duration: 240,
          useNativeDriver: true,
        }).start();
        addEventSheetTranslateY.value = withTiming(0, {
          duration: ADD_EVENT_SHEET_SLIDE_MS,
        });
      } else {
        RNAnimated.timing(o, {
          toValue: 0,
          duration: ADD_EVENT_SHEET_SLIDE_MS,
          useNativeDriver: true,
        }).start();
        addEventSheetTranslateY.value = withTiming(
          ADD_EVENT_SHEET_INITIAL_OFFSET,
          { duration: ADD_EVENT_SHEET_SLIDE_MS },
          (finished) => {
            if (finished) scheduleOnRN(setAddEventModalMounted, false);
          },
        );
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps -- addEventSheetTranslateY is a stable shared value
    }, []);

    const monthLabel = useMemo(
      () => monthShortFromDate(visibleDate),
      [visibleDate],
    );

    // Poll visible date during scroll so month updates mid-scroll (onDateChanged may only fire on settle)
    const lastPolledDateRef = useRef<string>(toDayString(visibleDate));
    useEffect(() => {
      lastPolledDateRef.current = toDayString(visibleDate);
    }, [visibleDate]);

    useEffect(() => {
      if (viewMode !== "3day") return;
      const POLL_MS = 80;
      const id = setInterval(() => {
        const visibleStart = calendarRef.current?.getVisibleStart?.();
        if (!visibleStart) return;
        const dateOnly = visibleStart.slice(0, 10);
        if (dateOnly !== lastPolledDateRef.current) {
          lastPolledDateRef.current = dateOnly;
          onDateChanged(dateOnly);
        }
      }, POLL_MS);
      return () => clearInterval(id);
    }, [viewMode, calendarRef, onDateChanged]);

    const renderEvent = useCallback(
      (event: PackedEvent, size: SizeAnimation) => (
        <EventBlock event={event} size={size} colors={colors} />
      ),
      [colors],
    );

    const onPressCalendarEvent = useCallback((ev: OnEventResponse) => {
      setCourseDetail(payloadFromCalendarPress(ev));
    }, []);

    const onPressListEvent = useCallback((e: ListEvent) => {
      setCourseDetail(payloadFromListEvent(e));
    }, []);

    const styles = useMemo(
      () => createStyles(colors, insets.bottom),
      [colors, insets.bottom],
    );

    // The label in 3day view
    const leftAreaComponent = useMemo(
      () => (
        <TouchableOpacity
          style={styles.cornerMonth}
          onPress={() => setPickerVisible(true)}
          activeOpacity={0.7}
        >
          <Text style={styles.cornerMonthText} numberOfLines={2}>
            {monthLabel}
          </Text>
        </TouchableOpacity>
      ),
      [styles, monthLabel],
    );

    const opacity3day = useSharedValue(viewMode === "3day" ? 1 : 0);
    const opacityList = useSharedValue(viewMode === "list" ? 1 : 0);

    const FADE_DURATION = 220;

    useEffect(() => {
      if (viewMode === "3day") {
        opacityList.value = withTiming(0, { duration: FADE_DURATION });
        opacity3day.value = withTiming(1, { duration: FADE_DURATION });
      } else {
        opacity3day.value = withTiming(0, { duration: FADE_DURATION });
        opacityList.value = withTiming(1, { duration: FADE_DURATION });
      }
    }, [viewMode, opacity3day, opacityList]);

    const animated3dayStyle = useAnimatedStyle(() => ({
      opacity: opacity3day.value,
      pointerEvents:
        opacity3day.value > 0.5 ? ("auto" as const) : ("none" as const),
    }));
    const animatedListStyle = useAnimatedStyle(() => ({
      opacity: opacityList.value,
      pointerEvents:
        opacityList.value > 0.5 ? ("auto" as const) : ("none" as const),
    }));

    // Keep both views mounted so switching back to 3-day is instant (no remount).
    return (
      <View style={styles.wrapper}>
        <Animated.View style={[StyleSheet.absoluteFill, animated3dayStyle]}>
          <CalendarContainer
            ref={calendarRef}
            numberOfDays={3}
            initialDate={toDayString(visibleDate)}
            minDate={getDateOffset(-10)}
            maxDate={getDateOffset(10)}
            theme={theme}
            scrollToNow={true}
            useHaptic={false}
            onDateChanged={onDateChanged}
            events={events}
            pagesPerSide={CALENDAR_PAGES_PER_SIDE}
            onPressEvent={onPressCalendarEvent}
          >
            <CalendarHeader LeftAreaComponent={leftAreaComponent} />
            <CalendarBody renderEvent={renderEvent} />
          </CalendarContainer>
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, animatedListStyle]}>
          <CalendarListView
            events={events as ListEvent[]}
            loadedStart={loadedStart}
            loadedEnd={loadedEnd}
            monthLabel={formatMonthYear(visibleDate)}
            onMonthPress={() => setPickerVisible(true)}
            onDatePress={onDateSelect}
            onVisibleRangeChange={onVisibleRangeChange}
            scrollToDate={scrollToDate}
            onScrollToDateHandled={onScrollToDateHandled}
            onEventPress={onPressListEvent}
          />
        </Animated.View>

        <Pressable
          style={styles.fab}
          onPress={() => setAddEventModalMounted(true)}
          accessibilityRole="button"
          accessibilityLabel="Add event"
        >
          <FontAwesome5 name="plus" size={22} color={colors.background} solid />
        </Pressable>

        <DatePickerModal
          visible={pickerVisible}
          selectedDate={toDayString(visibleDate)}
          onSelect={onDateSelect}
          onClose={() => setPickerVisible(false)}
        />

        <CourseDetailModal
          visible={courseDetail !== null}
          onClose={() => setCourseDetail(null)}
          detail={courseDetail}
        />

        {addEventModalMounted ? (
          <Modal
            transparent
            animationType="none"
            onShow={() => animateAddEventModal(true)}
            onRequestClose={() => animateAddEventModal(false)}
          >
            <View style={styles.addEventModalRoot}>
              <RNAnimated.View
                style={[
                  StyleSheet.absoluteFill,
                  {
                    opacity: addEventBackdropOpacityRef.current,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                  },
                ]}
              >
                <Pressable
                  style={StyleSheet.absoluteFill}
                  onPress={() => animateAddEventModal(false)}
                />
              </RNAnimated.View>
              <Animated.View
                pointerEvents="box-none"
                style={[styles.addEventSheetWrap, addEventSheetAnimatedStyle]}
              >
                <AddEventFormModal defaultDate={toDayString(visibleDate)} />
              </Animated.View>
            </View>
          </Modal>
        ) : null}
      </View>
    );
  }),
);
CalendarMain.displayName = "CalendarMain";

function truncate(str: string, max: number) {
  return str.length > max ? str.slice(0, max).trimEnd() + "…" : str;
}

function EventBlock({
  event,
  size,
  colors,
}: {
  event: PackedEvent;
  size: SizeAnimation;
  colors: ThemeColors;
}) {
  const containerStyle = useAnimatedStyle(() => ({
    width: size.width.value,
    height: size.height.value,
  }));

  const bg = (event.color as string | undefined) ?? colors.buttonBg;
  const widthPx = size.width.value;
  const maxChars = Math.floor(widthPx / 10) * 2;
  const title = truncate(event.title ?? "", maxChars);
  const location = truncate(event.location ?? "", maxChars);

  return (
    <Animated.View
      style={[eventStyles.container, containerStyle, { backgroundColor: bg }]}
    >
      <Text
        style={[eventStyles.title, { color: colors.eventText }]}
        numberOfLines={2}
      >
        {title + ` (${event.section})`}
      </Text>
      {!!location && (
        <Text
          style={[eventStyles.location, { color: colors.eventText }]}
          numberOfLines={1}
        >
          {location}
        </Text>
      )}
    </Animated.View>
  );
}

const eventStyles = StyleSheet.create({
  container: {
    borderRadius: 4,
    padding: 4,
    overflow: "hidden",
  },
  title: {
    fontSize: 11,
    fontWeight: "600",
    lineHeight: 14,
  },
  location: {
    fontSize: 10,
    lineHeight: 13,
    marginTop: 1,
  },
});

function createStyles(colors: ThemeColors, bottomInset: number) {
  return StyleSheet.create({
    wrapper: {
      flex: 1,
      minHeight: 400,
    },
    fab: {
      position: "absolute",
      right: 16,
      bottom: 16 + bottomInset,
      width: 56,
      height: 56,
      borderRadius: 28,
      backgroundColor: colors.text,
      opacity: 1,
      alignItems: "center",
      justifyContent: "center",
      shadowColor: colors.text,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.28,
      shadowRadius: 6,
      elevation: 8,
    },
    cornerMonth: {
      flex: 1,
      justifyContent: "center",
      paddingHorizontal: 4,
    },
    cornerMonthText: {
      fontSize: 17,
      textAlign: "center",
      fontWeight: "700",
      color: colors.text,
    },
    addEventModalRoot: {
      flex: 1,
      justifyContent: "flex-end",
      overflow: "hidden",
    },
    addEventSheetWrap: {
      flex: 1,
      width: "100%",
      justifyContent: "flex-end",
    },
  });
}
