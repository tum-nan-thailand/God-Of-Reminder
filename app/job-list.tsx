// app/screens/JobListScreen.tsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { DatabaseContext } from './DatabaseContext'; // ดึง Context สำหรับการใช้งาน Database
import { getAllJobs } from './database'; // ฟังก์ชันสำหรับดึงข้อมูลจากฐานข้อมูล
import { useTheme } from './ThemeProvider'; // นำเข้า useTheme จาก ThemeProvider

export default function JobListScreen() {
  const [jobs, setJobs] = useState([]);
  const db = useContext(DatabaseContext); // ใช้ Context สำหรับ Database
  const { theme } = useTheme(); // ดึงธีมจาก Context

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const jobList = await getAllJobs(db); // ดึงข้อมูลจากฐานข้อมูล
        setJobs(jobList);
      } catch (error) {
        console.error('Failed to fetch jobs:', error);
      }
    };

    fetchJobs(); // เรียกใช้ฟังก์ชันดึงข้อมูลเมื่อ Component ถูก mount
  }, [db]);

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
    <FlatList
      data={jobs}
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
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    padding: 10,
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
