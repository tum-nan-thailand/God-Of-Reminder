import React from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { clearDatabase } from '../sqlite/Job/Db'; // นำเข้าฟังก์ชันสำหรับลบฐานข้อมูล

export default function HomeScreen() {
  const router = useRouter();

  // ฟังก์ชันสำหรับการลบฐานข้อมูล
  const handleClearDatabase = async () => {
    try {
      await clearDatabase();
      Alert.alert('Success', 'Database has been cleared successfully!');
    } catch (error) {
      console.error('Failed to clear database:', error);
      Alert.alert('Error', 'Failed to clear the database.');
    }
  };

  return (
    <View style={styles.backgroundImage}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.headerContainer}>
          <MaterialIcons name="work-outline" size={48} color="#ffffff" />
          <Title style={styles.title}>Job Tracker App</Title>
          <Paragraph style={styles.subtitle}>Manage your job applications effectively</Paragraph>
        </View>

        <View style={styles.container}>
          <Card style={[styles.card, styles.cardJobList]} onPress={() => router.push('/job-list')}>
            <Card.Content style={styles.cardContent}>
              <MaterialIcons name="folder-open" size={48} color="#ff9800" style={styles.cardIcon} />
              <View style={styles.cardTextContainer}>
                <Title style={styles.cardTitle}>Job List</Title>
                <Paragraph style={styles.cardText}>View and manage your job applications</Paragraph>
              </View>
              <Button mode="contained" style={[styles.button, styles.viewButton]}>View</Button>
            </Card.Content>
          </Card>

          <Card style={[styles.card, styles.cardAddJob]} onPress={() => router.push('/add-job')}>
            <Card.Content style={styles.cardContent}>
              <MaterialIcons name="add-circle-outline" size={48} color="#4caf50" style={styles.cardIcon} />
              <View style={styles.cardTextContainer}>
                <Title style={styles.cardTitle}>Add New Job</Title>
                <Paragraph style={styles.cardText}>Register a new job application</Paragraph>
              </View>
              <Button mode="contained" style={[styles.button, styles.addButton]}>Add</Button>
            </Card.Content>
          </Card>

          <Card style={[styles.card, styles.cardScheduleInterview]} onPress={() => router.push('/schedule-interview')}>
            <Card.Content style={styles.cardContent}>
              <MaterialIcons name="schedule" size={48} color="#03a9f4" style={styles.cardIcon} />
              <View style={styles.cardTextContainer}>
                <Title style={styles.cardTitle}>Schedule Interview</Title>
                <Paragraph style={styles.cardText}>Track your interview schedules</Paragraph>
              </View>
              <Button mode="contained" style={[styles.button, styles.trackButton]}>Track</Button>
            </Card.Content>
          </Card>

          <View style={styles.clearButtonContainer}>
            <Button
              mode="contained"
              onPress={handleClearDatabase}
              style={styles.clearButton}
              icon="delete"
              color="#FF6347"
            >
              Clear Database
            </Button>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: '#f5f5f5', // เปลี่ยนสีพื้นหลังให้เป็นสีเทาอ่อนเพื่อความสวยงามและนุ่มนวล
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  headerContainer: {
    alignItems: 'center',
    paddingTop: 80, // เพิ่ม padding ด้านบนเพื่อให้ส่วนหัวห่างจากขอบมากขึ้น
    paddingBottom: 20,
    backgroundColor: '#ff8c00', // เปลี่ยนสีหัวเป็นสีส้มที่สว่างขึ้นเพื่อความโดดเด่น
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 32, // เพิ่มขนาดฟอนต์เพื่อให้ส่วนหัวโดดเด่นยิ่งขึ้น
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16, // เพิ่มขนาดฟอนต์ของ subtitle
    textAlign: 'center',
    color: '#ffffff',
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#ffffff', // สีพื้นหลังของ container ด้านใน
    borderRadius: 20,
  },
  card: {
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
    backgroundColor: '#ffffff',
  },
  cardJobList: {
    borderLeftWidth: 5,
    borderLeftColor: '#ff9800',
  },
  cardAddJob: {
    borderLeftWidth: 5,
    borderLeftColor: '#4caf50',
  },
  cardScheduleInterview: {
    borderLeftWidth: 5,
    borderLeftColor: '#03a9f4',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  cardTextContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  cardIcon: {
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 20, // เพิ่มขนาดฟอนต์ของหัวข้อการ์ด
    fontWeight: 'bold',
    color: '#333',
  },
  cardText: {
    fontSize: 16, // เพิ่มขนาดฟอนต์ของข้อความการ์ดเพื่อให้อ่านง่ายขึ้น
    color: '#666',
  },
  button: {
    borderRadius: 25,
  },
  viewButton: {
    backgroundColor: '#ffa726', // ปรับสีปุ่มให้สว่างขึ้นเพื่อให้ดูสดใส
  },
  addButton: {
    backgroundColor: '#66bb6a', // ปรับสีปุ่มให้สว่างขึ้น
  },
  trackButton: {
    backgroundColor: '#29b6f6', // ปรับสีปุ่มให้สว่างขึ้น
  },
  clearButtonContainer: {
    marginTop: 40, // เพิ่ม marginTop เพื่อให้ปุ่ม Clear Database ห่างจากส่วนอื่นมากขึ้น
    alignItems: 'center',
  },
  clearButton: {
    borderRadius: 25,
    paddingVertical: 12, // เพิ่ม padding ให้ปุ่มใหญ่ขึ้น
    paddingHorizontal: 30,
    backgroundColor: '#ff5252', // ปรับสีปุ่มให้ดูสดใสขึ้น
  },
});