import {
  darkColors,
  darkCourseColors,
  lightColors,
  lightCourseColors,
  type CourseColors,
  type ThemeColors,
  type ColorScheme as ThemeColorScheme,
} from "@/lib/colors";
import { useColorScheme } from "react-native";

/**
 * Returns theme colors that follow the device's light/dark setting.
 * On iOS and Android, useColorScheme() reflects the system preference.
 * When the system preference is unavailable (e.g. null), defaults to "dark".
 */
export function useThemeColors(): ThemeColors {
  const scheme = useColorScheme();
  return scheme === "light" ? lightColors : darkColors;
}

/**
 * Returns the current color scheme name ("light" | "dark").
 * Useful when you need the scheme itself, not just colors.
 */
export function useColorSchemeName(): ThemeColorScheme {
  const scheme = useColorScheme();
  return scheme === "light" ? "light" : "dark";
}

/**
 * Returns the course color palette for the current light/dark scheme.
 */
export function useCourseColors(): CourseColors[] {
  const scheme = useColorScheme();
  return scheme === "light" ? lightCourseColors : darkCourseColors;
}
