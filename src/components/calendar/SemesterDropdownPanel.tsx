import { useCourseColors, useThemeColors } from "@/hooks/useThemeColors";
import type { ThemeColors } from "@/lib/colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { memo, useMemo, useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  CourseDetailModal,
  payloadFromCourseRow,
  type CourseDetailPayload,
} from "./CourseDetailModal";

type CourseRow = {
  id: number;
  code: string;
  title: string;
  section: number;
  location: string;
};

type SemesterDropdownPanelProps = {
  selectedSemester: string;
  onSelectSemester: (code: string) => void;
  selectedSchedule: string;
  onSelectSchedule: (name: string) => void;
  schedules: string[];
  semesters: string[];
  courses: CourseRow[];
};

export const SemesterDropdownPanel = memo(function SemesterDropdownPanel({
  selectedSemester,
  onSelectSemester,
  selectedSchedule,
  onSelectSchedule,
  schedules,
  semesters,
  courses,
}: SemesterDropdownPanelProps) {
  const colors = useThemeColors();
  const courseColors = useCourseColors();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [sheetVisible, setSheetVisible] = useState(false);
  const [courseDetail, setCourseDetail] = useState<CourseDetailPayload | null>(
    null,
  );

  const handleSelectSchedule = (name: string) => {
    onSelectSchedule(name);
    setSheetVisible(false);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.semesterScroll}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.semesterScrollContent}
      >
        {semesters.map((code) => (
          <TouchableOpacity
            key={code}
            style={[
              styles.semesterChip,
              selectedSemester === code && styles.semesterChipSelected,
            ]}
            onPress={() => onSelectSemester(code)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.semesterChipText,
                selectedSemester === code && styles.semesterChipTextSelected,
              ]}
            >
              {code}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {/* Selected schedule row */}
      <TouchableOpacity
        style={styles.scheduleRow}
        onPress={() => setSheetVisible(true)}
        activeOpacity={0.7}
      >
        <Text style={styles.scheduleRowText}>{selectedSchedule}</Text>
        <FontAwesome5
          name="arrow-down"
          size={12}
          color={colors.textSecondary}
        />
      </TouchableOpacity>

      {/* Courses list */}
      <ScrollView
        style={styles.coursesScroll}
        showsVerticalScrollIndicator={false}
        bounces={false}
        nestedScrollEnabled
      >
        {courses.length === 0 ? (
          <Text style={styles.emptyText}>No courses added yet</Text>
        ) : (
          courses.map((course, index) => (
            <TouchableOpacity
              key={course.id}
              style={styles.courseRow}
              activeOpacity={0.7}
              onPress={() => setCourseDetail(payloadFromCourseRow(course))}
            >
              <View
                style={[
                  styles.courseColorBar,
                  { backgroundColor: courseColors[index]?.background },
                ]}
              />
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle} numberOfLines={1}>
                  {course.title}{" "}
                  <Text style={styles.courseSection}>
                    ({String(course.section).padStart(2, "0")})
                  </Text>
                </Text>
                <Text style={styles.courseSubtitle} numberOfLines={1}>
                  {course.code}
                  {course.location ? `  ·  ${course.location}` : ""}
                </Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      {/* Schedule picker bottom sheet */}
      <Modal
        visible={sheetVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setSheetVisible(false)}
      >
        <Pressable
          style={styles.backdrop}
          onPress={() => setSheetVisible(false)}
        />
        <View style={styles.sheet}>
          <View style={styles.sheetHandle} />
          <Text style={styles.sheetTitle}>Select Schedule</Text>
          <ScrollView
            bounces={false}
            contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}
          >
            {schedules.map((name) => (
              <TouchableOpacity
                key={name}
                style={styles.sheetItem}
                onPress={() => handleSelectSchedule(name)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.sheetItemText,
                    name === selectedSchedule && styles.sheetItemTextSelected,
                  ]}
                >
                  {name}
                </Text>
                {name === selectedSchedule && (
                  <FontAwesome5 name="check" size={14} color={colors.text} />
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>

      <CourseDetailModal
        visible={courseDetail !== null}
        onClose={() => setCourseDetail(null)}
        detail={courseDetail}
      />
    </View>
  );
});

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      marginBottom: 16,
      paddingHorizontal: 14,
    },
    coursesScroll: {
      maxHeight: 180,
    },
    courseRow: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: 10,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderMuted,
      gap: 12,
    },
    courseColorBar: {
      width: 6,
      height: 36,
      borderRadius: 2,
    },
    courseInfo: {
      flex: 1,
      gap: 2,
    },
    courseTitle: {
      color: colors.text,
      fontSize: 13,
      fontWeight: "600",
    },
    courseSection: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: "400",
    },
    courseSubtitle: {
      color: colors.textMuted,
      fontSize: 12,
      marginTop: 1,
    },
    emptyText: {
      color: colors.textMuted,
      fontSize: 13,
      paddingVertical: 12,
      paddingHorizontal: 4,
    },
    scheduleRow: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderMuted,
    },
    scheduleRowText: {
      color: colors.text,
      fontSize: 17,
      fontWeight: "600",
    },
    semesterScroll: {
      paddingTop: 12,
      padding: 5,
    },
    semesterScrollContent: {
      flexDirection: "row",
      gap: 8,
      paddingRight: 8,
    },
    semesterChip: {
      paddingVertical: 8,
      paddingHorizontal: 14,
      borderRadius: 20,
      backgroundColor: colors.buttonBg,
    },
    semesterChipSelected: {
      backgroundColor: colors.textMuted,
    },
    semesterChipText: {
      color: colors.text,
      fontSize: 14,
      fontWeight: "600",
    },
    semesterChipTextSelected: {
      color: colors.surface,
    },
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
    },
    sheet: {
      backgroundColor: colors.surface,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      paddingTop: 12,
      paddingHorizontal: 16,
      maxHeight: "60%",
    },
    sheetHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.borderMuted,
      alignSelf: "center",
      marginBottom: 16,
    },
    sheetTitle: {
      color: colors.textMuted,
      fontSize: 12,
      fontWeight: "600",
      textTransform: "uppercase",
      marginBottom: 8,
      paddingHorizontal: 4,
    },
    sheetItem: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingVertical: 16,
      paddingHorizontal: 4,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderMuted,
    },
    sheetItemText: {
      color: colors.textSecondary,
      fontSize: 16,
    },
    sheetItemTextSelected: {
      color: colors.text,
      fontWeight: "600",
    },
  });
}
