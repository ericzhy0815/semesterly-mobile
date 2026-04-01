import { useThemeColors } from "@/hooks/useThemeColors";
import type { ThemeColors } from "@/lib/colors";
import type { CalendarViewMode } from "@/stores/calendarStore";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export type CalendarViewType = CalendarViewMode;

const ORDER: CalendarViewType[] = ["3day", "list"];
const LABELS: Record<CalendarViewType, string> = {
  "3day": "3 Day",
  list: "List",
};
const ICONS: Record<CalendarViewType, "list" | "calendar-alt"> = {
  "3day": "calendar-alt",
  list: "list",
};

type CalendarViewToggleProps = {
  value: CalendarViewType;
  onChange: (value: CalendarViewType) => void;
};

export function CalendarViewToggle({
  value,
  onChange,
}: CalendarViewToggleProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  const cycle = () => {
    const i = ORDER.indexOf(value);
    const next = ORDER[(i + 1) % ORDER.length];
    onChange(next);
  };

  return (
    <TouchableOpacity style={styles.button} onPress={cycle} activeOpacity={0.7}>
      <View style={styles.content}>
        <FontAwesome5 name={ICONS[value]} size={20} color={colors.icon} solid />
        <Text style={styles.label}>{LABELS[value]}</Text>
      </View>
    </TouchableOpacity>
  );
}

const TOGGLE_WIDTH = 40;

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    button: {
      width: TOGGLE_WIDTH,
      alignItems: "center",
      justifyContent: "center",
      marginLeft: -2,
    },
    content: {
      flexDirection: "column",
      alignItems: "center",
    },
    label: {
      color: colors.text,
      fontSize: 12,
      fontWeight: "600",
    },
  });
}
