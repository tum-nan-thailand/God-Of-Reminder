import React from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, Card, Title, Paragraph } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <MaterialIcons name="work-outline" size={48} color="#ffffff" />
          <Title style={styles.title}>ตัวช่วยจัดการงาน</Title>
          <Paragraph style={styles.subtitle}>
            สมัครงานง่าย ๆ และติดตามผลได้สะดวก
          </Paragraph>
        </View>

        <View style={styles.container}>
          <Card
            style={[styles.card, styles.cardJobList]}
            onPress={() => router.push("/job-list")}
          >
            <Card.Content style={styles.cardContent}>
              <MaterialIcons
                name="folder-open"
                size={48}
                color="#ff9800"
                style={styles.cardIcon}
              />
              <View style={styles.cardTextContainer}>
                <Title style={styles.cardTitle}>รายการของฉัน</Title>
                <Paragraph style={styles.cardText}>
                  ดูงานทั้งหมดที่คุณสมัครไว้
                </Paragraph>
              </View>
              <Button
                mode="contained"
                style={[styles.button, styles.viewButton]}
              >
                เปิดดู
              </Button>
            </Card.Content>
          </Card>

          <Card
            style={[styles.card, styles.cardAddJob]}
            onPress={() => router.push("/add-job")}
          >
            <Card.Content style={styles.cardContent}>
              <MaterialIcons
                name="add-circle-outline"
                size={48}
                color="#4caf50"
                style={styles.cardIcon}
              />
              <View style={styles.cardTextContainer}>
                <Title style={styles.cardTitle}>เพิ่มงานใหม่</Title>
                <Paragraph style={styles.cardText}>
                  เพิ่มรายการสมัครงานใหม่
                </Paragraph>
              </View>
              <Button
                mode="contained"
                style={[styles.button, styles.addButton]}
              >
                เพิ่ม
              </Button>
            </Card.Content>
          </Card>

          <Card
            style={[styles.card, styles.cardScheduleInterview]}
            onPress={() => router.push("/schedule-interview")}
          >
            <Card.Content style={styles.cardContent}>
              <MaterialIcons
                name="schedule"
                size={48}
                color="#03a9f4"
                style={styles.cardIcon}
              />
              <View style={styles.cardTextContainer}>
                <Title style={styles.cardTitle}>ติดตามนัดสัมภาษณ์</Title>
                <Paragraph style={styles.cardText}>
                  ตรวจสอบวันที่สัมภาษณ์ของคุณ
                </Paragraph>
              </View>
              <Button
                mode="contained"
                style={[styles.button, styles.trackButton]}
              >
                ตรวจสอบ
              </Button>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    paddingBottom: 20,
    marginTop: "10%",
  },
  headerContainer: {
    alignItems: "center",
    paddingVertical: 30, // ลด padding ด้านบนเพื่อให้พื้นที่มากขึ้น
    backgroundColor: "#ff8c00",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 20,
  },
  title: {
    fontSize: 28, // ลดขนาดตัวอักษรของชื่อแอป
    fontWeight: "bold",
    marginTop: 5, // ลดระยะห่างด้านบน
    textAlign: "center",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 14, // ลดขนาดตัวอักษรของคำอธิบายเพื่อให้พอดี
    textAlign: "center",
    color: "#ffffff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginHorizontal: 20,
    marginBottom: -20,
  },
  card: {
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
    backgroundColor: "#ffffff",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  cardTextContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  cardTitle: {
    fontSize: 18, // ลดขนาดตัวอักษรในหัวข้อการ์ดเพื่อให้ไม่โดนกิน
    fontWeight: "bold",
    color: "#333",
  },
  cardText: {
    fontSize: 14, // ลดขนาดข้อความการ์ดเพื่อให้ดูพอดีขึ้น
    color: "#666",
  },
  button: {
    borderRadius: 25,
    paddingVertical: 5,
  },
  viewButton: {
    backgroundColor: "#ffa726",
  },
  addButton: {
    backgroundColor: "#66bb6a",
  },
  trackButton: {
    backgroundColor: "#29b6f6",
  },
});
