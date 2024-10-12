// app/theme.ts
import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

export const lightTheme = {
  ...MD3LightTheme,
  colors: {
    primary: '#fa9c3e',
    background: '#ffffff',
    text: '#333333',
    card: '#f0f0f0',
    border: '#cccccc',
    notification: '#fa9c3e',
    accent: '#FFD700',
  },
  fonts: {
    regular: {
      fontFamily: 'SpaceMono',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'SpaceMono',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'SpaceMono',
      fontWeight: '300',
    },
    bold: {
      fontFamily: 'SpaceMono',
      fontWeight: 'bold',
    },
    // เพิ่มฟอนต์ที่เกี่ยวข้องกับการแสดงผลใน Text
    labelLarge: {
      fontFamily: 'SpaceMono',
      fontWeight: 'normal',
    },
    bodyLarge: {
      fontFamily: 'SpaceMono',
      fontWeight: 'normal',
    },
    bodyMedium: {
      fontFamily: 'SpaceMono',
      fontWeight: 'normal',
    },
    bodySmall: {
      fontFamily: 'SpaceMono',
      fontWeight: 'normal',
    },
  },
};

export const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    primary: '#fa9c3e',
    background: '#1c1c1c',
    text: '#ffffff',
    card: '#333333',
    border: '#666666',
    notification: '#fa9c3e',
    accent: '#FFD700',
  },
  fonts: {
    regular: {
      fontFamily: 'SpaceMono',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'SpaceMono',
      fontWeight: '500',
    },
    light: {
      fontFamily: 'SpaceMono',
      fontWeight: '300',
    },
    bold: {
      fontFamily: 'SpaceMono',
      fontWeight: 'bold',
    },
    labelLarge: {
      fontFamily: 'SpaceMono',
      fontWeight: 'normal',
    },
    bodyLarge: {
      fontFamily: 'SpaceMono',
      fontWeight: 'normal',
    },
    bodyMedium: {
      fontFamily: 'SpaceMono',
      fontWeight: 'normal',
    },
    bodySmall: {
      fontFamily: 'SpaceMono',
      fontWeight: 'normal',
    },
  },
};
