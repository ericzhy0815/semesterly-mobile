import { useThemeColors } from "@/hooks/useThemeColors";
import type { ThemeColors } from "@/lib/colors";
import Fontisto from "@expo/vector-icons/Fontisto";
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const colors = useThemeColors();
  const router = useRouter();
  const styles = createStyles(colors);

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
        <Text style={[styles.title, { color: colors.text }]}>Profile</Text>
      </View>
      <View style={styles.body}>
        <Text style={[styles.placeholder, { color: colors.textMuted }]}>
          Profile settings and account details will appear here.
        </Text>
      </View>
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
    title: {
      fontSize: 20,
      fontWeight: "700",
    },
    body: {
      flex: 1,
      paddingHorizontal: 20,
      paddingTop: 8,
    },
    placeholder: {
      fontSize: 16,
      lineHeight: 22,
    },
  });
}
