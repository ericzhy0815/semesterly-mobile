/**
 * Shared light/dark theme colors.
 * Use with useThemeColors() to get colors that follow the device setting.
 */

export type ColorScheme = "light" | "dark";

export const lightColors: ThemeColors = {
  background: "#FFFFFF",
  surface: "#FFFFFF",
  surfaceMuted: "#EEEEEE",
  border: "#E0E0E0",
  borderMuted: "#E8E8E8",
  text: "#253340",
  textSecondary: "#666666",
  textMuted: "#777777",
  icon: "#253340",
  iconMuted: "#777777",
  buttonBg: "#E8E8E8",
  buttonBgPressed: "#DDDDDD",
  todayContainerBg: "#E8E8E8",
  skippedDayBg: "#E5E5E5",
  skippedDayTodayBg: "#D0D0D0",
  eventText: "#253340",
} as const;

export const darkColors: ThemeColors = {
  background: "#1D1E22",
  surface: "#222222",
  surfaceMuted: "#2a2a2a",
  border: "#2a2a2a",
  borderMuted: "#333333",
  text: "#CEDDEB",
  textSecondary: "#e0e0e0",
  textMuted: "#888888",
  icon: "#CEDDEB",
  iconMuted: "#888888",
  buttonBg: "#2a2a2a",
  buttonBgPressed: "#333333",
  todayContainerBg: "#888888",
  skippedDayBg: "#2e2e2e",
  skippedDayTodayBg: "#444444",
  eventText: "#253340",
} as const;

type ThemeColors = {
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  borderMuted: string;
  text: string;
  textSecondary: string;
  textMuted: string;
  icon: string;
  iconMuted: string;
  buttonBg: string;
  buttonBgPressed: string;
  todayContainerBg: string;
  skippedDayBg: string;
  skippedDayTodayBg: string;
  eventText: string;
};

export interface CourseColors {
  background: string;
  highlight: string;
  border: string;
  font: string;
}

export const lightCourseColors: CourseColors[] = [
  // red
  {
    background: "#FD7473",
    highlight: "#e36867",
    border: "#b15150",
    font: "#222",
  },
  // blue
  {
    background: "#5CCCF2",
    highlight: "#52b7d9",
    border: "#408ea9",
    font: "#222",
  },
  // turquoise
  {
    background: "#36DEBB",
    highlight: "#30c7a8",
    border: "#259b82",
    font: "#222",
  },
  // 'yellow'
  {
    background: "#FFD462",
    highlight: "#e5be58",
    border: "#b29444",
    font: "#222",
  },
  // purple
  {
    background: "#C585DE",
    highlight: "#b177c7",
    border: "#895d9b",
    font: "#222",
  },
  // green
  {
    background: "#53e997",
    highlight: "#4ad187",
    border: "#3aa369",
    font: "#222",
  },
  {
    background: "#D4DBC8",
    highlight: "#B5BFA3",
    border: "#97A086",
    font: "#222",
  },
  {
    background: "#E7F76D",
    highlight: "#C9E20A",
    border: "#AFC11F",
    font: "#222",
  },
  {
    background: "#A3F5F2",
    highlight: "#7CD2CF",
    border: "#53ABA8",
    font: "#222",
  },
  {
    background: "#7499A2",
    highlight: "#668B94",
    border: "#6C7A89",
    font: "#222",
  },
  {
    background: "#C8F7C5",
    highlight: "#b4deb1",
    border: "#8cac89",
    font: "#222",
  },
  // last
  {
    background: "#4c7fd8",
    highlight: "#6598f1",
    border: "#375994",
    font: "#222",
  },

  // x2
  {
    background: "#FD7473",
    highlight: "#e36867",
    border: "#b15150",
    font: "#222",
  },
  {
    background: "#5CCCF2",
    highlight: "#52b7d9",
    border: "#408ea9",
    font: "#222",
  },
  {
    background: "#36DEBB",
    highlight: "#30c7a8",
    border: "#259b82",
    font: "#222",
  },
  {
    background: "#FFD462",
    highlight: "#e5be58",
    border: "#b29444",
    font: "#222",
  },
  {
    background: "#C585DE",
    highlight: "#b177c7",
    border: "#895d9b",
    font: "#222",
  },
  {
    background: "#53e997",
    highlight: "#4ad187",
    border: "#3aa369",
    font: "#222",
  },
  {
    background: "#D4DBC8",
    highlight: "#B5BFA3",
    border: "#97A086",
    font: "#222",
  },
  {
    background: "#E7F76D",
    highlight: "#C9E20A",
    border: "#AFC11F",
    font: "#222",
  },
  {
    background: "#A3F5F2",
    highlight: "#7CD2CF",
    border: "#53ABA8",
    font: "#222",
  },
  {
    background: "#7499A2",
    highlight: "#668B94",
    border: "#6C7A89",
    font: "#222",
  },
  {
    background: "#C8F7C5",
    highlight: "#C4D44D",
    border: "#548A50",
    font: "#222",
  },
  {
    background: "#4c7fd8",
    highlight: "#6598f1",
    border: "#375994",
    font: "#222",
  },
]; // consider #CF000F, #e8fac3, #C8F7C5
// 20%
export const darkCourseColors: CourseColors[] = [
  // red
  {
    background: "#F16E66",
    highlight: "#d8635b",
    border: "#a84d47",
    font: "#222",
  },
  // blue
  {
    background: "#5598DF",
    highlight: "#4c88c8",
    border: "#3b6a9c",
    font: "#222",
  },
  // turquoise
  {
    background: "#57C3B9",
    highlight: "#4eafa6",
    border: "#3c8881",
    font: "#222",
  },
  // 'yellow'
  {
    background: "#F2B25C",
    highlight: "#d9a052",
    border: "#a97c40",
    font: "#222",
  },
  // purple
  {
    background: "#7C72DC",
    highlight: "#6f66c6",
    border: "#564f92",
    font: "#222",
  },
  // green
  {
    background: "#59BEA0",
    highlight: "#50ab90",
    border: "#3e8570",
    font: "#222",
  },
  {
    background: "#F3863D",
    highlight: "#da7836",
    border: "#aa5d2a",
    font: "#222",
  },
  {
    background: "#9E81B6",
    highlight: "#8e74a3",
    border: "#6e5a7f",
    font: "#222",
  },
  {
    background: "#54C1E3",
    highlight: "#4badcc",
    border: "#3a879e",
    font: "#222",
  },
  {
    background: "#7499A2",
    highlight: "#668B94",
    border: "#6C7A89",
    font: "#222",
  },
  {
    background: "#b4deb1",
    highlight: "#a2c79f",
    border: "#7d9b7b",
    font: "#222",
  },
  // last
  {
    background: "#4c7fd8",
    highlight: "#6598f1",
    border: "#375994",
    font: "#222",
  },

  // x2
  {
    background: "#F16E66",
    highlight: "#d8635b",
    border: "#a84d47",
    font: "#222",
  },
  {
    background: "#5598DF",
    highlight: "#4c88c8",
    border: "#3b6a9c",
    font: "#222",
  },
  {
    background: "#57C3B9",
    highlight: "#4eafa6",
    border: "#3c8881",
    font: "#222",
  },
  {
    background: "#F2B25C",
    highlight: "#d9a052",
    border: "#a97c40",
    font: "#222",
  },
  {
    background: "#7C72DC",
    highlight: "#6f66c6",
    border: "#564f92",
    font: "#222",
  },
  {
    background: "#59BEA0",
    highlight: "#50ab90",
    border: "#3e8570",
    font: "#222",
  },
  {
    background: "#F3863D",
    highlight: "#da7836",
    border: "#aa5d2a",
    font: "#222",
  },
  {
    background: "#9E81B6",
    highlight: "#8e74a3",
    border: "#6e5a7f",
    font: "#222",
  },
  {
    background: "#54C1E3",
    highlight: "#4badcc",
    border: "#3a879e",
    font: "#222",
  },
  {
    background: "#7499A2",
    highlight: "#668B94",
    border: "#6C7A89",
    font: "#222",
  },
  {
    background: "#b4deb1",
    highlight: "#a2c79f",
    border: "#7d9b7b",
    font: "#222",
  },
  {
    background: "#4c7fd8",
    highlight: "#6598f1",
    border: "#375994",
    font: "#222",
  },
]; // consider #CF000F, #e8fac3, #C8F7C5

export type { ThemeColors };
