import { useThemeColors } from "@/hooks/useThemeColors";
import type { ThemeColors } from "@/lib/colors";
import { semesterLabel } from "@/lib/semester";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

type SemesterSelectorProps = {
  selectedSemester: string;
  expanded: boolean;
  onPress: () => void;
};

export function SemesterSelector({
  selectedSemester,
  expanded,
  onPress,
}: SemesterSelectorProps) {
  const colors = useThemeColors();
  const styles = createStyles(colors);

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Text style={styles.label} numberOfLines={1}>
        {semesterLabel(selectedSemester)}
      </Text>
      <FontAwesome5
        name={expanded ? "chevron-up" : "chevron-down"}
        size={14}
        color={colors.icon}
        style={styles.chevron}
        s
        solid
      />
    </TouchableOpacity>
  );
}

function createStyles(colors: ThemeColors) {
  return StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      gap: 4,
      paddingVertical: 10,
      paddingHorizontal: 4,
    },
    label: {
      color: colors.text,
      fontSize: 22,
      fontWeight: "600",
    },
    chevron: {
      marginLeft: 2,
    },
  });
}
