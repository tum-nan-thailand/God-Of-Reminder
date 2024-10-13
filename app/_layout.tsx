// app/_layout.tsx
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { initializeDB } from "./sqlite/Job/Db";
import { DatabaseContext } from "./DatabaseContext";
import { ThemeProvider } from "./ThemeProvider"; // นำเข้า ThemeProvider ที่สร้างขึ้น
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import { useColorScheme } from "@/hooks/useColorScheme";
import FlashMessage from "react-native-flash-message";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [db, setDb] = useState(null);
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  // Load Database
  useEffect(() => {
    const setupDatabase = async () => {
      try {
        const database = await initializeDB();
        setDb(database);
      } catch (error) {
        console.error("Failed to initialize database:", error);
      }
    };
    setupDatabase();
  }, []);

  // Hide SplashScreen after fonts are loaded
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!db || !fontsLoaded) {
    return null; // Show loading or splash screen
  }

  const customeHeader = {
    headerBackTitle: "กลับ",
    headerBackTitleStyle: { fontSize: 16 },
  };

  return (
    <DatabaseContext.Provider value={db}>
      <ThemeProvider>
        <FlashMessage position="top" />
        <Stack
          screenOptions={{
            headerShown: true,
            ...customeHeader,
          }}
        >
          <Stack.Screen name="add-job" options={{ title: "Add Job" }} />
          <Stack.Screen name="job-detail" options={{ title: "Job Detail" }} />
          <Stack.Screen name="profile" options={{ title: "Profile" }} />
          <Stack.Screen name="edit-job" options={{ title: "Edit Job" }} />
          <Stack.Screen
            name="schedule-interview"
            options={{ title: "Schedule Interview" }}
          />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </DatabaseContext.Provider>
  );
}
