// app/ThemeProvider.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { useColorScheme } from 'react-native';
import { lightTheme, darkTheme } from './theme';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState(colorScheme === 'dark' ? darkTheme : lightTheme);

  const [fontsLoaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  useEffect(() => {
    setTheme(colorScheme === 'dark' ? darkTheme : lightTheme);
  }, [colorScheme]);

  if (!fontsLoaded) {
    return null; // แสดง SplashScreen หรือหน้าโหลดขณะที่กำลังโหลดฟอนต์
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <PaperProvider theme={theme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
