/**
 * Onboarding challenge (implemented here):
 *
 * When the user opens Help from the calendar sidebar, the copy should reflect
 * which calendar mode they were using:
 * - **3-day** — tips for the three-column schedule grid (swipe, tap events, etc.).
 * - **List** — tips for the scrollable agenda list (month headers, day sections).
 *
 * Implementation: `calendarView` lives in `useCalendarStore` (see `calendarStore.ts`).
 * This screen reads it so Help stays in sync with the last selected mode.
 */

import { useThemeColors } from "@/hooks/useThemeColors";
import type { ThemeColors } from "@/lib/colors";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCalendarStore } from "@/stores/calendarStore";

const HELP_3DAY = [
  "The three-day strip shows your classes in time blocks. Swipe left or right to move through the week.",
  "Tap the month in the corner to jump to any date.",
  "Tap a class block to see details like section and location.",
  "Use the + button to add a personal event (when available).",
];

const HELP_LIST = [
  "List view groups your schedule by month and day. Scroll to browse everything in order.",
  "Tap a month title to open the date picker and jump quickly.",
  "Tap a day header to focus the calendar on that date in other views.",
  "Tap an event row for the same details as in the 3-day grid.",
];


export default function HelpScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const styles = createStyles(colors);
  const calendarView = useCalendarStore((state) => state.calendarView);
  const helpContent = calendarView === "3day" ? HELP_3DAY : HELP_LIST;


  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Fontisto name="angle-left" size={24} color={colors.icon} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Help</Text>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.modePill,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.modePillText, { color: colors.textMuted }]}>
            Tips for
          </Text>
          <Text style={[styles.modePillStrong, { color: colors.text }]}>
            {calendarView == "3day" ? "3-day view":"list view"}
          </Text>
        </View>
        <View>
          {helpContent.map((item, index) => (
            <View key={index} style={styles.bulletRow}>
              <Text style={[styles.bulletDot, { color: colors.textMuted }]}>
                •
              </Text>
              <Text style={[styles.bulletText, { color: colors.text }]}>
                {item}
              </Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 12,
      gap: 8,
    },
    backButton: {
      padding: 8,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: "700",
    },
    scroll: {
      flex: 1,
    },
    scrollContent: {
      paddingHorizontal: 20,
      paddingBottom: 32,
    },
    modePill: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      gap: 6,
      alignSelf: "flex-start",
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderRadius: 12,
      borderWidth: 1,
      marginBottom: 16,
    },
    modePillText: {
      fontSize: 14,
      fontWeight: "500",
    },
    modePillStrong: {
      fontSize: 14,
      fontWeight: "700",
    },
    intro: {
      fontSize: 15,
      lineHeight: 22,
      marginBottom: 16,
    },
    bulletRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: 10,
      marginBottom: 12,
    },
    bulletDot: {
      fontSize: 16,
      lineHeight: 22,
      marginTop: 1,
    },
    bulletText: {
      flex: 1,
      fontSize: 16,
      lineHeight: 22,
    },
  });
}
