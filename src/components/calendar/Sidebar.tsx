import { useColorSchemeName, useThemeColors } from "@/hooks/useThemeColors";
import type { ThemeColors } from "@/lib/colors";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scheduleOnRN } from "react-native-worklets";

const ICON_SIZE = 22;
const LOGO_SIZE = 45;
/** Sidebar width as a fraction of screen width (0.75 = 75%) */
const SIDEBAR_WIDTH_PERCENT = 0.7;

const SIDEBAR_OPTIONS: {
  icon: "cog" | "chart-bar" | "user" | "question-circle" | "user-friends";
  label: string;
  href?: "/profile" | "/friends" | "/settings" | "/help";
}[] = [
  { icon: "user", label: "Profile", href: "/profile" },
  { icon: "chart-bar", label: "Stats" },
  { icon: "user-friends", label: "Friends", href: "/friends" },
  { icon: "cog", label: "Settings", href: "/settings" },
  { icon: "question-circle", label: "Help", href: "/help" },
];
const BACKDROP_OPACITY = 0.45;
const ANIMATION_DURATION = 280;

export type SidebarRef = {
  close: () => void;
};

type SidebarProps = {
  visible: boolean;
  onClose: () => void;
};

export const Sidebar = forwardRef<SidebarRef, SidebarProps>(function Sidebar(
  { visible, onClose },
  ref,
) {
  const { width: windowWidth } = useWindowDimensions();
  const sidebarWidth = Math.round(windowWidth * SIDEBAR_WIDTH_PERCENT);
  const sidebarWidthRef = useRef(sidebarWidth);
  sidebarWidthRef.current = sidebarWidth;

  const colors = useThemeColors();
  const colorScheme = useColorSchemeName();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const styles = createStyles(colors, insets.top, sidebarWidth);
  const logoSource = useMemo(
    () =>
      colorScheme === "dark"
        ? require("@assets/semesterly-dark.png")
        : require("@assets/semesterly.png"),
    [colorScheme],
  );
  const qrSource = useMemo(() => require("@assets/qrcode.png"), []);
  const translateX = useSharedValue(-sidebarWidth);
  const backdropOpacity = useSharedValue(0);
  const [mounted, setMounted] = useState(false);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    if (visible) {
      setMounted(true);
      translateX.value = -sidebarWidth;
      translateX.value = withTiming(0, { duration: ANIMATION_DURATION });
      backdropOpacity.value = withTiming(1, { duration: ANIMATION_DURATION });
    }
    // translateX and backdropOpacity are Reanimated shared values (stable refs)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, sidebarWidth]);

  const finishClose = useCallback(() => {
    onCloseRef.current();
    setMounted(false);
  }, []);

  const close = useCallback(() => {
    translateX.value = withTiming(
      -sidebarWidthRef.current,
      { duration: ANIMATION_DURATION },
      (finished) => {
        if (finished) scheduleOnRN(finishClose);
      },
    );
    backdropOpacity.value = withTiming(0, {
      duration: ANIMATION_DURATION,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finishClose]);

  useImperativeHandle(ref, () => ({ close }), [close]);

  const panelAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const backdropAnimatedStyle = useAnimatedStyle(() => ({
    opacity: backdropOpacity.value * BACKDROP_OPACITY,
  }));

  if (!visible && !mounted) return null;

  const handleBackdropPress = () => {
    close();
  };

  return (
    <View style={styles.overlay} pointerEvents="box-none">
      <Animated.View style={[styles.backdrop, backdropAnimatedStyle]}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleBackdropPress}
          accessibilityRole="button"
          accessibilityLabel="Close menu"
        />
      </Animated.View>
      <Animated.View style={[styles.panel, panelAnimatedStyle]}>
        <View style={styles.panelTop}>
          <View style={styles.logoRow}>
            <Image
              source={logoSource}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={[styles.logoName, { color: colors.text }]}>
              Semester.ly
            </Text>
          </View>
          <View style={styles.optionsGrid}>
            {SIDEBAR_OPTIONS.map(({ icon, label, href }) => (
              <Pressable
                key={label}
                style={styles.sidebarItem}
                onPress={() => {
                  if (href) {
                    close();
                    router.push(href);
                  }
                }}
                disabled={!href}
              >
                <View style={styles.sidebarItemIconSlot}>
                  <FontAwesome5
                    name={icon}
                    size={ICON_SIZE}
                    color={colors.icon}
                    solid
                  />
                </View>
                <Text style={[styles.sidebarItemText, { color: colors.text }]}>
                  {label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={[styles.qrSection, { paddingBottom: insets.bottom + 16 }]}>
          <Image
            source={qrSource}
            style={styles.qrImage}
            resizeMode="contain"
          />
          <Text style={[styles.qrHelpText, { color: colors.textMuted }]}>
            Add me as a friend!
          </Text>
        </View>
      </Animated.View>
    </View>
  );
});

function createStyles(
  colors: ThemeColors,
  topInset: number,
  sidebarWidth: number,
) {
  return StyleSheet.create({
    overlay: {
      ...StyleSheet.absoluteFillObject,
      flexDirection: "row",
      zIndex: 20,
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: "black",
    },
    panel: {
      position: "absolute",
      left: 0,
      top: 0,
      bottom: 0,
      width: sidebarWidth,
      backgroundColor: colors.surface,
      borderRightWidth: 1,
      borderRightColor: colors.border,
      paddingTop: topInset + 4,
      paddingHorizontal: 16,
      paddingRight: 20,
      flexDirection: "column",
      justifyContent: "space-between",
      overflow: "visible",
    },
    panelTop: {
      flex: 1,
    },
    logoRow: {
      alignSelf: "stretch",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      marginBottom: 24,
      gap: 4,
    },
    logo: {
      width: LOGO_SIZE,
      height: LOGO_SIZE,
    },
    logoName: {
      fontSize: 22,
      fontWeight: "700",
    },
    optionsGrid: {
      marginTop: 20,
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 26,
      paddingRight: 4,
      overflow: "visible",
    },
    sidebarItem: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      padding: 4,
      gap: 10,
    },
    sidebarItemIconSlot: {
      width: 28,
      minWidth: 28,
      alignItems: "center",
      justifyContent: "center",
      marginRight: 10,
    },
    sidebarItemText: {
      fontSize: 16,
      fontWeight: "500",
    },
    qrSection: {
      alignSelf: "stretch",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 6,
    },
    qrImage: {
      width: 100,
      height: 100,
    },
    qrHelpText: {
      fontSize: 14,
      fontWeight: "500",
    },
  });
}
