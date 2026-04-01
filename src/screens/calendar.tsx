import {
  CalendarMain,
  type CalendarMainRef,
} from "@/components/calendar/CalendarMain";
import {
  CalendarViewToggle,
  type CalendarViewType,
} from "@/components/calendar/CalendarViewToggle";
import { SemesterDropdownPanel } from "@/components/calendar/SemesterDropdownPanel";
import { SemesterSelector } from "@/components/calendar/SemesterSelector";
import { Sidebar, type SidebarRef } from "@/components/calendar/Sidebar";
import { useCalendarDate } from "@/hooks/useCalendarDate";
import { useCourseColors, useThemeColors } from "@/hooks/useThemeColors";
import type { ThemeColors } from "@/lib/colors";
import { fromDayString } from "@/lib/date";
import { useCalendarStore } from "@/stores/calendarStore";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

const ICON_SIZE = 23;
const SEMESTER_DROPDOWN_MAX_PX = 420;
const SEMESTER_DROPDOWN_ANIM_MS = 280;

export default function CalendarScreen() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [dropdownExpanded, setDropdownExpanded] = useState(false);
  const [scrollToDate, setScrollToDate] = useState<Date | null>(null);
  const sidebarRef = useRef<SidebarRef>(null);
  const calendarMainRef = useRef<CalendarMainRef>(null);
  const insets = useSafeAreaInsets();
  const colors = useThemeColors();
  const courseColors = useCourseColors();
  const styles = createStyles(colors, insets.top);
  const router = useRouter();

  const {
    semesters,
    activeSemesterId,
    activeScheduleId,
    calendarEvents,
    loadedStart,
    loadedEnd,
    getTodayDate,
    setActiveSemester,
    setActiveSchedule,
    setTailDate,
    setListVisibleIndices,
    calendarView,
    setCalendarView,
  } = useCalendarStore();

  const { setVisibleDate, calendarRef, onDateChanged, visibleDate } =
    useCalendarDate();

  const activeSemester = semesters.find((s) => s.id === activeSemesterId);
  const activeSchedule = activeSemester?.schedules.find(
    (s: any) => s.id === activeScheduleId,
  );

  const semesterCodes = useMemo(
    () => semesters.map((s) => s.code),
    [semesters],
  );
  const scheduleNames = useMemo(
    () => activeSemester?.schedules.map((s: any) => s.name) ?? [],
    [activeSemester?.schedules],
  );
  const dropdownCourses = useMemo(
    () =>
      (activeSchedule?.courses ?? []).map((c: any) => ({
        id: c.id,
        code: c.code,
        title: c.title,
        section: c.section ?? 0,
        location: c.location ?? "",
      })),
    [activeSchedule?.courses],
  );

  const calendarEventItems = useMemo(() => {
    const seen = new Set<number>();
    return calendarEvents
      .filter((e) => {
        if (seen.has(e.id)) return false;
        seen.add(e.id);
        return true;
      })
      .map((e) => ({
        id: String(e.id),
        title: e.courseTitle,
        section: e.courseSection ?? "",
        location: e.courseLocation ?? "",
        start: { dateTime: e.startDateTime },
        end: { dateTime: e.endDateTime },
        color: courseColors[e.courseColorIndex]?.background,
      }));
  }, [calendarEvents, courseColors]);

  // ─── Handlers ───────────────────────────────────────────────────────────────

  const navigateCalendarToDate = useCallback(
    (d: Date) => {
      setVisibleDate(d);
      setScrollToDate(d);
    },
    [setVisibleDate],
  );

  const handleSelectSemester = useCallback(
    (code: string) => {
      const semester = semesters.find((s) => s.code === code);
      if (!semester) return;
      setActiveSemester(semester.id);
      calendarMainRef.current?.goToSemesterStart(semester.startDate);
    },
    [semesters, setActiveSemester],
  );

  const handleSelectSchedule = useCallback(
    (name: string) => {
      const schedule = activeSemester?.schedules.find((s) => s.name === name);
      if (schedule) setActiveSchedule(schedule.id);
    },
    [activeSemester?.schedules, setActiveSchedule],
  );

  // ─── UI ─────────────────────────────────────────────────────────────────────

  const goToToday = () => {
    navigateCalendarToDate(getTodayDate());
  };

  const handleDateSelect = useCallback(
    (date: string) => {
      navigateCalendarToDate(fromDayString(date.slice(0, 10)));
    },
    [navigateCalendarToDate],
  );

  const handleScrollToDateHandled = useCallback(
    () => setScrollToDate(null),
    [],
  );

  const handleViewChange = useCallback(
    (view: CalendarViewType) => {
      setCalendarView(view);
      if (view === "list") {
        setScrollToDate(visibleDate);
        setTailDate(visibleDate);
      }
    },
    [visibleDate, setTailDate, setCalendarView],
  );

  const handleVisibleRangeChange = useCallback(
    (
      anchorDate: string,
      tailDateStr: string,
      topmostIndex?: number,
      bottommostIndex?: number,
      listLength?: number,
    ) => {
      if (calendarView !== "list") return;
      if (scrollToDate != null) return;
      setVisibleDate(fromDayString(anchorDate));
      setTailDate(fromDayString(tailDateStr));
      if (
        topmostIndex !== undefined &&
        bottommostIndex !== undefined &&
        listLength !== undefined
      ) {
        setListVisibleIndices(topmostIndex, bottommostIndex, listLength);
      }
    },
    [
      calendarView,
      setVisibleDate,
      setTailDate,
      setListVisibleIndices,
      scrollToDate,
    ],
  );

  const todayDayNumber = getTodayDate().getDate();
  const dropdownProgress = useSharedValue(0);
  const dropdownClosing = useSharedValue(0);

  const timingConfig = useMemo(
    () => ({
      duration: SEMESTER_DROPDOWN_ANIM_MS,
      easing: Easing.out(Easing.cubic),
    }),
    [],
  );

  const toggleSemesterDropdown = useCallback(() => {
    if (dropdownExpanded) {
      dropdownClosing.value = 1;
      dropdownProgress.value = withTiming(0, timingConfig, (finished) => {
        if (finished) {
          scheduleOnRN(setDropdownExpanded, false);
        }
      });
    } else {
      dropdownClosing.value = 0;
      setDropdownExpanded(true);
      dropdownProgress.value = withTiming(1, timingConfig);
    }
  }, [dropdownExpanded, dropdownProgress, dropdownClosing, timingConfig]);

  useEffect(() => {
    if (!dropdownExpanded) {
      dropdownClosing.value = 0;
    }
  }, [dropdownExpanded, dropdownClosing]);

  const dropdownFadeStyle = useAnimatedStyle(() => ({
    opacity: dropdownProgress.value,
  }));

  const dropdownSlotStyle = useAnimatedStyle(() => {
    if (!dropdownExpanded) {
      return { maxHeight: 0, overflow: "hidden" as const };
    }
    if (dropdownClosing.value === 1) {
      return {
        maxHeight: dropdownProgress.value * SEMESTER_DROPDOWN_MAX_PX,
        overflow: "hidden" as const,
      };
    }
    return {
      maxHeight: SEMESTER_DROPDOWN_MAX_PX,
      overflow: "hidden" as const,
    };
  }, [dropdownExpanded]);

  const calendarSlideStyle = useAnimatedStyle(() => {
    if (!dropdownExpanded) {
      return { transform: [{ translateY: 0 }] };
    }
    if (dropdownClosing.value === 1) {
      return { transform: [{ translateY: 0 }] };
    }
    const p = dropdownProgress.value;
    return {
      transform: [
        {
          translateY: -SEMESTER_DROPDOWN_MAX_PX * (1 - p),
        },
      ],
    };
  }, [dropdownExpanded]);

  const handleMenuPress = () => {
    if (sidebarOpen) {
      sidebarRef.current?.close();
    } else {
      setSidebarOpen(true);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={[]}>
      <View style={styles.wrapper}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.topBarButton}
            onPress={handleMenuPress}
            activeOpacity={0.7}
          >
            <FontAwesome5
              name="bars"
              size={ICON_SIZE}
              color={colors.icon}
              solid
            />
          </TouchableOpacity>
          <SemesterSelector
            selectedSemester={activeSemester?.code ?? ""}
            expanded={dropdownExpanded}
            onPress={toggleSemesterDropdown}
          />
          <View style={styles.topBarSpacer} />
          <TouchableOpacity
            style={styles.topBarButton}
            onPress={() => router.push("/search")}
            activeOpacity={0.7}
          >
            <Fontisto name="search" size={ICON_SIZE} color={colors.icon} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.todayButton}
            onPress={goToToday}
            activeOpacity={0.7}
          >
            <View style={styles.todayStickyNoteWrap}>
              <FontAwesome6 name="sticky-note" size={30} color={colors.icon} />
              <View style={styles.todayStickyNoteOverlay}>
                <Text
                  style={[styles.todayStickyNoteText, { color: colors.text }]}
                  numberOfLines={1}
                >
                  {todayDayNumber}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
          <CalendarViewToggle
            value={calendarView}
            onChange={handleViewChange}
          />
        </View>

        <View style={styles.body}>
          <View style={styles.main}>
            <Animated.View style={dropdownSlotStyle}>
              <Animated.View style={dropdownFadeStyle}>
                <SemesterDropdownPanel
                  selectedSemester={activeSemester?.code ?? ""}
                  onSelectSemester={handleSelectSemester}
                  selectedSchedule={
                    activeSchedule?.name ?? "No schedule selected"
                  }
                  onSelectSchedule={handleSelectSchedule}
                  schedules={scheduleNames}
                  semesters={semesterCodes}
                  courses={dropdownCourses}
                />
              </Animated.View>
            </Animated.View>

            <Animated.View style={[styles.calendarSlot, calendarSlideStyle]}>
              <CalendarMain
                ref={calendarMainRef}
                viewMode={calendarView}
                calendarRef={calendarRef}
                onDateChanged={onDateChanged}
                onDateSelect={handleDateSelect}
                visibleDate={visibleDate}
                loadedStart={loadedStart}
                loadedEnd={loadedEnd}
                onVisibleRangeChange={handleVisibleRangeChange}
                scrollToDate={scrollToDate}
                onScrollToDateHandled={handleScrollToDateHandled}
                events={calendarEventItems}
                onNavigateToDate={navigateCalendarToDate}
              />
            </Animated.View>
          </View>
        </View>

        <Sidebar
          ref={sidebarRef}
          visible={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </View>
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors, topInset: number) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    wrapper: {
      flex: 1,
      position: "relative",
    },
    topBar: {
      flexDirection: "row",
      alignItems: "center",
      paddingTop: topInset,
      paddingHorizontal: 20,
      paddingBottom: 6,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      gap: 8,
      backgroundColor: colors.background,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 3,
    },
    topBarButton: {
      paddingVertical: 10,
      paddingHorizontal: 4,
    },
    todayButton: {
      padding: 2,
    },
    todayStickyNoteWrap: {
      width: 30,
      height: 30,
      position: "relative",
      alignItems: "center",
      justifyContent: "center",
    },
    todayStickyNoteOverlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: "center",
      justifyContent: "center",
    },
    todayStickyNoteText: {
      fontSize: 11,
      fontWeight: "700",
    },
    topBarSpacer: {
      flex: 1,
    },
    body: {
      flex: 1,
      position: "relative",
    },
    main: {
      flex: 1,
    },
    calendarSlot: {
      flex: 1,
      minHeight: 0,
    },
  });
}
