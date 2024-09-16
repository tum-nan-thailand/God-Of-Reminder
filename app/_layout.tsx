import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/useColorScheme";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="job-list" options={{ title: "Job List" }} />
      <Stack.Screen name="add-job" options={{ title: "Add Job" }} />
      <Stack.Screen name="job-detail" options={{ title: "Job Detail" }} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
      <Stack.Screen
        name="schedule-interview"
        options={{ title: "Schedule Interview" }}
      />

      <Stack.Screen name="+not-found" />
    </Stack>
  );
}
