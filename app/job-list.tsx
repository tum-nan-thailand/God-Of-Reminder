import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { DatabaseContext } from './DatabaseContext'; // ดึง Context สำหรับการใช้งาน Database
import { getAllJobs } from './database'; // ฟังก์ชันสำหรับดึงข้อมูลจากฐานข้อมูล
import { useTheme } from './ThemeProvider'; // นำเข้า useTheme จาก ThemeProvider

export default function JobListScreen() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State สำหรับเก็บคำค้นหา
  const [filteredJobs, setFilteredJobs] = useState([]); // State สำหรับเก็บข้อมูลงานที่กรองแล้ว
  const db: any = useContext(DatabaseContext); // ใช้ Context สำหรับ Database
  const { theme } = useTheme(); // ดึงธีมจาก Context

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobList = await getAllJobs(db); // ดึงข้อมูลจากฐานข้อมูล
        setJobs(jobList);
        setFilteredJobs(jobList); // ตั้งค่า filteredJobs เป็น jobList เริ่มต้น
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    };

    fetchJobs(); // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ Component ถูก mount
  }, [db]);

  // ฟังก์ชันสำหรับกรองข้อมูลตามคำค้นหา
  const handleSearch = (text: string) => {
    setSearchTerm(text);

    if (text === '') {
      setFilteredJobs(jobs); // แสดงข้อมูลทั้งหมดถ้าไม่มีคำค้นหา
    } else {
      const filtered = jobs.filter((job) =>
        job.position.toLowerCase().includes(text.toLowerCase()) ||
        job.company.toLowerCase().includes(text.toLowerCase()) ||
        job.status.toLowerCase().includes(text.toLowerCase()) // กรองตามตำแหน่ง, บริษัท, และสถานะ
      );
      setFilteredJobs(filtered); // อัปเดตข้อมูลที่กรองแล้ว
    }
  };

  // ตรวจสอบว่ามีข้อมูลหรือไม่
  if (jobs.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          No jobs found. Add some jobs!
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextInput
        style={[styles.searchInput, { backgroundColor: theme.colors.card, color: theme.colors.text }]}
        placeholder="Search jobs..."
        value={searchTerm}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredJobs} // ใช้ข้อมูลที่ถูกกรองแล้ว
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
            <Card.Title title={item.position} subtitle={item.company} />
            <Card.Content>
              <Text style={[styles.text, { color: theme.colors.text }]}>
                Status: {item.status}
              </Text>
              <Text style={[styles.text, { color: theme.colors.text }]}>
                Applied on: {item.applicationDate}
              </Text>
              {item.notes ? (
                <Text style={[styles.text, { color: theme.colors.text }]}>
                  Notes: {item.notes}
                </Text>
              ) : null}
            </Card.Content>
            <Card.Actions>
              <Button mode="text" color={theme.colors.primary}>
                Edit
              </Button>
              <Button mode="text" color={theme.colors.primary}>
                Delete
              </Button>
            </Card.Actions>
          </Card>
        )}
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  searchInput: {
    padding: 10,
    marginBottom: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  contentContainer: {
    paddingBottom: 10,
  },
  card: {
    margin: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3,
  },
  text: {
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
  },
});
