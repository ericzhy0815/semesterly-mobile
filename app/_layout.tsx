import { fetchUserSchedule } from "@/api/semesterlyApi";
import { syncFromApi } from "@/db/syncDb";
import { db, sqlite } from "@/db/client";
import { addDays, fromDayString } from "@/lib/date";
import { useCalendarStore } from "@/stores/calendarStore";
import migrations from "@/db/migrations/migrations";
import { DarkTheme, ThemeProvider } from "@react-navigation/native";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import { ActivityIndicator, View } from "react-native";
import { configureReanimatedLogger } from "react-native-reanimated";

if (__DEV__) {
  configureReanimatedLogger({ strict: false });
}

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);

  useDrizzleStudio(sqlite);

  // On first load after migrations: immediately hydrate from the local DB (fast),
  // then sync from the API in the background and reload once done.
  const synced = useRef(false);
  useEffect(() => {
    if (success && !synced.current) {
      synced.current = true;
      const { loadSemesters, loadEvents } = useCalendarStore.getState();
      const today = fromDayString(new Date().toISOString().slice(0, 10));
      const radius = 20 * 3; // CALENDAR_PAGES_PER_SIDE * CALENDAR_DAYS_PER_PAGE

      // Show whatever is cached in the DB immediately.
      loadSemesters();
      loadEvents(addDays(today, -radius), addDays(today, radius));

      // Sync from the API in the background, then refresh the store.
      fetchUserSchedule()
        .then(syncFromApi)
        .then(() => {
          loadSemesters();
          loadEvents(addDays(today, -radius), addDays(today, radius));
        })
        .catch((err) => console.error("[sync] Failed:", err));
    }
  }, [success]);

  if (error) throw error;

  if (!success) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ThemeProvider value={DarkTheme}>
      <Stack
        screenOptions={{
          animation: "fade",
          animationDuration: 200,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="search"
          options={{
            headerShown: false,
            animation: "fade",
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            headerShown: false,
            animation: "fade",
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="friends"
          options={{
            headerShown: false,
            animation: "fade",
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="settings"
          options={{
            headerShown: false,
            animation: "fade",
            animationDuration: 200,
          }}
        />
        <Stack.Screen
          name="help"
          options={{
            headerShown: false,
            animation: "fade",
            animationDuration: 200,
          }}
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
