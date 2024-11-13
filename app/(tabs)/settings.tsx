import React, { useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { List, Switch, Button, Text, Divider } from "react-native-paper";
import { useTheme } from "../ThemeProvider";
import { DatabaseContext } from "../DatabaseContext";
import { exportDatabase, clearDatabase } from "../sqlite/Job/Db";
import { MaterialIcons } from "@expo/vector-icons";
import { showMessage } from "react-native-flash-message";

export default function SettingsScreen() {
  const { theme } = useTheme();
  const db = useContext(DatabaseContext);

  const handleExportData = async () => {
    try {
      await exportDatabase();
      showMessage({
        message: "สำเร็จ",
        description: "ส่งออกข้อมูลเรียบร้อยแล้ว",
        type: "success",
      });
    } catch (error) {
      showMessage({
        message: "ข้อผิดพลาด",
        description: "ไม่สามารถส่งออกข้อมูลได้",
        type: "danger",
      });
    }
  };

  const handleResetData = async () => {
    try {
      await clearDatabase();
      showMessage({
        message: "สำเร็จ",
        description: "รีเซ็ตข้อมูลเรียบร้อยแล้ว",
        type: "success",
      });
    } catch (error) {
      showMessage({
        message: "ข้อผิดพลาด",
        description: "ไม่สามารถรีเซ็ตข้อมูลได้",
        type: "danger",
      });
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <List.Section style={{ marginTop: "10%", ...styles.section }}>
        <List.Subheader style={{ color: theme.colors.primary }}>
          ตั้งค่าการแจ้งเตือน
        </List.Subheader>
        <List.Item
          title="แจ้งเตือนการสัมภาษณ์"
          description="รับการแจ้งเตือนก่อนถึงวันสัมภาษณ์"
          left={(props) => <List.Icon {...props} icon="bell" />}
          right={(props) => <Switch {...props} />}
        />
        <Divider />
        <List.Item
          title="แจ้งเตือนล่วงหน้า"
          description="ระยะเวลาแจ้งเตือนก่อนถึงวันสัมภาษณ์"
          left={(props) => <List.Icon {...props} icon="clock" />}
          right={(props) => <Text>1 วัน</Text>}
        />
      </List.Section>

      <List.Section style={styles.section}>
        <List.Subheader style={{ color: theme.colors.primary }}>
          จัดการข้อมูล
        </List.Subheader>
        <List.Item
          title="ส่งออกข้อมูล"
          description="บันทึกข้อมูลการสมัครงานทั้งหมด"
          left={(props) => <List.Icon {...props} icon="database-export" />}
          onPress={handleExportData}
        />
        <Divider />
        <List.Item
          title="รีเซ็ตข้อมูล"
          description="ล้างข้อมูลการสมัครงานทั้งหมด"
          left={(props) => (
            <List.Icon {...props} icon="delete" color={theme.colors.error} />
          )}
          onPress={handleResetData}
        />
      </List.Section>

      <List.Section style={styles.section}>
        <List.Subheader style={{ color: theme.colors.primary }}>
          เกี่ยวกับแอพ
        </List.Subheader>
        <List.Item
          title="เวอร์ชัน"
          description="1.0.0"
          left={(props) => <List.Icon {...props} icon="information" />}
        />
      </List.Section>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 16,
  },
});
