import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { DatabaseContext } from './DatabaseContext'; // ดึง Context สำหรับการใช้งาน Database
import { useTheme } from './ThemeProvider'; // นำเข้า useTheme จาก ThemeProvider
import { useNavigation } from '@react-navigation/native'; // ใช้สำหรับการนำทาง
import {getAllJobs,deleteJob} from "./service/Job"

export default function JobListScreen() {
  const [jobs, setJobs] = useState([]);
  const [searchTerm, setSearchTerm] = useState(''); // State สำหรับเก็บคำค้นหา
  const [filteredJobs, setFilteredJobs] = useState([]); // State สำหรับเก็บข้อมูลงานที่กรองแล้ว
  const db: any = useContext(DatabaseContext); // ใช้ Context สำหรับ Database
  const { theme } = useTheme(); // ดึงธีมจาก Context
  const navigation = useNavigation(); // ใช้ useNavigation สำหรับการนำทาง

  useEffect(() => {
    fetchJobs();
  }, [db]);

  const fetchJobs = async () => {
    try {
      const jobList = await getAllJobs(); // ดึงข้อมูลจากฐานข้อมูล
      setJobs(jobList);
      setFilteredJobs(jobList);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    }
  };

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

  const handleDeleteJob = async (jobId: number) => {
    try {
      await deleteJob(jobId);
      Alert.alert('Success', 'Job deleted successfully!');
      fetchJobs();
    } catch (error) {
      console.error('Failed to delete job:', error);
      Alert.alert('Error', 'Failed to delete the job.');
    }
  };

  // ตรวจสอบว่ามีข้อมูลหรือไม่
  if (jobs.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: theme.colors.background }]}>
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>No jobs found. Add some jobs!</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <TextInput
        style={[styles.searchInput, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.primary }]}
        placeholder="Search jobs..."
        placeholderTextColor={theme.colors.placeholder}
        value={searchTerm}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredJobs} // ใช้ข้อมูลที่ถูกกรองแล้ว
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={[styles.card, { backgroundColor: theme.colors.card, borderColor: theme.colors.primary, borderWidth: 1 }]}> 
            <TouchableOpacity style={styles.deleteIcon} onPress={() => handleDeleteJob(item.id)}>
              <MaterialIcons name="close" size={24} color={theme.colors.error} />
            </TouchableOpacity>
            <Card.Title
              title={item.position}
              subtitle={item.company}
              titleStyle={{ color: theme.colors.primary, fontWeight: 'bold', fontSize: 22 }}
              subtitleStyle={{ color: theme.colors.textSecondary, fontSize: 16 }}
            />
            <Card.Content>
              <View style={styles.cardContentRow}>
                <Text style={[styles.text, { color: theme.colors.text }]}>Status:</Text>
                <Text style={[styles.textValue, { color: theme.colors.primary }]}>{item.status}</Text>
              </View>
              <View style={styles.cardContentRow}>
                <Text style={[styles.text, { color: theme.colors.text }]}>Applied on:</Text>
                <Text style={[styles.textValue, { color: theme.colors.textSecondary }]}>{item.applicationDate}</Text>
              </View>
              {item.notes ? (
                <View style={styles.cardContentRow}>
                  <Text style={[styles.text, { color: theme.colors.text }]}>Notes:</Text>
                  <Text style={[styles.textValue, { color: theme.colors.textSecondary }]}>{item.notes}</Text>
                </View>
              ) : null}
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button
                mode="contained"
                icon={() => <FontAwesome name="pencil" size={16} color={theme.colors.onPrimary} />}
                labelStyle={{ color: theme.colors.onPrimary }}
                style={[styles.button, { backgroundColor: theme.colors.primary }]}
                onPress={() => navigation.navigate('edit-job', { jobId: item.id })}
              >
                Edit
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
    padding: 12,
    marginBottom: 20,
    borderRadius: 25,
    borderWidth: 1.5,
  },
  contentContainer: {
    paddingBottom: 10,
  },
  card: {
    marginVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    position: 'relative',
  },
  deleteIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  cardContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
  text: {
    fontSize: 17,
    fontWeight: '600',
  },
  textValue: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  button: {
    marginHorizontal: 8,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingRight: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
});