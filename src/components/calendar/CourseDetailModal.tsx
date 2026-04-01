import { useThemeColors } from "@/hooks/useThemeColors";
import type { ThemeColors } from "@/lib/colors";
import { formatTimeRange } from "@/lib/date";
import type { OnEventResponse } from "@howljs/calendar-kit";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";
import type { ListEvent } from "./CalendarListView";

export type CourseDetailPayload = {
  title: string;
  code?: string;
  section?: string;
  location?: string;
  timeRange?: string;
};

type CourseDetailModalProps = {
  visible: boolean;
  onClose: () => void;
  detail: CourseDetailPayload | null;
};

function getDateTimeIso(
  d: { dateTime?: string; date?: string } | undefined,
): string | undefined {
  if (!d || typeof d !== "object") return undefined;
  if (typeof d.dateTime === "string") return d.dateTime;
  return undefined;
}

/** Map a tapped calendar-kit event to modal fields. */
export function payloadFromCalendarPress(
  ev: OnEventResponse,
): CourseDetailPayload {
  const start = getDateTimeIso(ev.start as { dateTime?: string });
  const end = getDateTimeIso(ev.end as { dateTime?: string });
  let timeRange: string | undefined;
  if (start && end) timeRange = formatTimeRange(start, end);
  const section =
    typeof ev.section === "string" && ev.section.length > 0
      ? ev.section
      : undefined;
  const location =
    typeof ev.location === "string" && ev.location.length > 0
      ? ev.location
      : undefined;
  return {
    title: ev.title ?? "Event",
    section,
    location,
    timeRange,
  };
}

export function payloadFromListEvent(e: ListEvent): CourseDetailPayload {
  return {
    title: e.title,
    section: e.section,
    location: e.location,
    timeRange: formatTimeRange(e.start.dateTime, e.end.dateTime),
  };
}

export function payloadFromCourseRow(c: {
  code: string;
  title: string;
  section: number;
  location: string;
}): CourseDetailPayload {
  return {
    title: c.title,
    code: c.code,
    section: String(c.section).padStart(2, "0"),
    location: c.location || undefined,
  };
}

export function CourseDetailModal({
  visible,
  onClose,
  detail,
}: CourseDetailModalProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  if (!detail) return null;

  const rows: { label: string; value: string }[] = [];
  if (detail.code) rows.push({ label: "Code", value: detail.code });
  if (detail.section) rows.push({ label: "Section", value: detail.section });
  if (detail.timeRange) rows.push({ label: "Time", value: detail.timeRange });
  if (detail.location) rows.push({ label: "Location", value: detail.location });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable
          style={[styles.card, { backgroundColor: colors.surface }]}
          onPress={() => {}}
        >
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={3}
          >
            {detail.title}
          </Text>
          {rows.map((r) => (
            <View key={r.label} style={styles.row}>
              <Text style={[styles.label, { color: colors.textMuted }]}>
                {r.label}
              </Text>
              <Text style={[styles.value, { color: colors.text }]}>
                {r.value}
              </Text>
            </View>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    backdrop: {
      flex: 1,
      backgroundColor: "rgba(0,0,0,0.5)",
      justifyContent: "center",
      alignItems: "center",
      padding: 24,
    },
    card: {
      width: "100%",
      maxWidth: 340,
      borderRadius: 16,
      padding: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    title: {
      fontSize: 18,
      fontWeight: "700",
      marginBottom: 14,
    },
    row: {
      marginTop: 10,
    },
    label: {
      fontSize: 12,
      fontWeight: "600",
      marginBottom: 2,
    },
    value: {
      fontSize: 15,
    },
  });
}
