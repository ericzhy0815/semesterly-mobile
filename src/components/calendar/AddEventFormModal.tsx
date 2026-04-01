import { useThemeColors } from "@/hooks/useThemeColors";
import type { ThemeColors } from "@/lib/colors";
import { useMemo, useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { DatePickerModal } from "./DatePickerModal";

type AddEventFormModalProps = {
  defaultDate: string;
};

/** Sheet body only; parent (`CalendarMain`) owns the `Modal` and dimmed backdrop. */
export function AddEventFormModal({ defaultDate }: AddEventFormModalProps) {
  const colors = useThemeColors();
  const insets = useSafeAreaInsets();
  const styles = useMemo(
    () => createStyles(colors, insets.bottom),
    [colors, insets.bottom],
  );

  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("10:00");
  const [datePickerOpen, setDatePickerOpen] = useState(false);

  return (
    <>
      <Pressable
        style={[styles.sheet, { backgroundColor: colors.surface }]}
        onPress={() => {}}
      >
        <View style={styles.handle} />
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Text style={[styles.headerTitle, { color: colors.text }]}>
            New event
          </Text>

          <Text style={[styles.label, { color: colors.textMuted }]}>Title</Text>
          <TextInput
            style={[
              styles.input,
              {
                color: colors.text,
                borderColor: colors.border,
                backgroundColor: colors.background,
              },
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder="Event title"
            placeholderTextColor={colors.textMuted}
          />

          <Text style={[styles.label, { color: colors.textMuted }]}>Date</Text>
          <Pressable
            style={[
              styles.input,
              styles.dateButton,
              {
                borderColor: colors.border,
                backgroundColor: colors.background,
              },
            ]}
            onPress={() => setDatePickerOpen(true)}
          >
            <Text style={{ color: colors.text }}>{date}</Text>
          </Pressable>

          <Text style={[styles.label, { color: colors.textMuted }]}>
            Time range
          </Text>
          <View style={styles.timeRow}>
            <View style={styles.timeField}>
              <Text style={[styles.sublabel, { color: colors.textMuted }]}>
                Start
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
                value={startTime}
                onChangeText={setStartTime}
                placeholder="09:00"
                placeholderTextColor={colors.textMuted}
              />
            </View>
            <View style={styles.timeField}>
              <Text style={[styles.sublabel, { color: colors.textMuted }]}>
                End
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.text,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
                value={endTime}
                onChangeText={setEndTime}
                placeholder="10:00"
                placeholderTextColor={colors.textMuted}
              />
            </View>
          </View>
        </ScrollView>
      </Pressable>

      <DatePickerModal
        visible={datePickerOpen}
        selectedDate={date}
        onSelect={(d) => {
          setDate(d.slice(0, 10));
          setDatePickerOpen(false);
        }}
        onClose={() => setDatePickerOpen(false)}
      />
    </>
  );
}

function createStyles(colors: ThemeColors, bottomInset: number) {
  return StyleSheet.create({
    sheet: {
      width: "100%",
      maxHeight: "100%",
      alignSelf: "stretch",
      borderTopLeftRadius: 16,
      borderTopRightRadius: 16,
      paddingBottom: Math.max(bottomInset, 12),
      elevation: 16,
    },
    handle: {
      alignSelf: "center",
      width: 36,
      height: 4,
      borderRadius: 2,
      backgroundColor: colors.border,
      marginTop: 10,
      marginBottom: 8,
    },
    scroll: {
      maxHeight: "100%",
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 24,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
      marginBottom: 20,
    },
    label: {
      fontSize: 13,
      fontWeight: "600",
      marginBottom: 6,
      marginTop: 4,
    },
    sublabel: {
      fontSize: 12,
      marginBottom: 4,
    },
    input: {
      borderWidth: 1,
      borderRadius: 10,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontSize: 16,
    },
    dateButton: {
      justifyContent: "center",
    },
    timeRow: {
      flexDirection: "row",
      gap: 12,
    },
    timeField: {
      flex: 1,
    },
  });
}
