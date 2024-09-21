// app/screens/AddJobScreen.tsx
import React, { useState, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Card, Text } from 'react-native-paper';
import { DatabaseContext } from './DatabaseContext'; // ใช้ Context หากต้องการเข้าถึง db ทั่วแอป
import { addJob } from './database'; // Import ฟังก์ชันเพิ่มข้อมูล
import { useTheme } from './ThemeProvider'; // นำเข้า useTheme จาก ThemeProvider

export default function AddJobScreen() {
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [applicationDate, setApplicationDate] = useState('');
  const [status, setStatus] = useState('');
  const [notes, setNotes] = useState('');
  const db = useContext(DatabaseContext); // ใช้ Context สำหรับ Database
  const { theme } = useTheme(); // ดึงธีมจาก Context

  // ฟังก์ชันสำหรับเพิ่มข้อมูลงานใหม่ในฐานข้อมูล
  const handleAddJob = async () => {
    try {
      await addJob(db, company, position, applicationDate, status, notes); // ใช้ addJob จาก database.ts
      setCompany('');
      setPosition('');
      setApplicationDate('');
      setStatus('');
      setNotes('');
    } catch (error) {
      console.error('Failed to add job:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Card.Title title="Add New Job" />
        <Card.Content>
          <TextInput
            label="Company"
            value={company}
            onChangeText={setCompany}
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
            mode="outlined"
            theme={{ colors: { primary: theme.colors.primary } }}
          />
          <TextInput
            label="Position"
            value={position}
            onChangeText={setPosition}
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
            mode="outlined"
            theme={{ colors: { primary: theme.colors.primary } }}
          />
          <TextInput
            label="Application Date"
            value={applicationDate}
            onChangeText={setApplicationDate}
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
            mode="outlined"
            theme={{ colors: { primary: theme.colors.primary } }}
            placeholder="YYYY-MM-DD"
          />
          <TextInput
            label="Status"
            value={status}
            onChangeText={setStatus}
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
            mode="outlined"
            theme={{ colors: { primary: theme.colors.primary } }}
            placeholder="e.g., Applied, Interview, Rejected"
          />
          <TextInput
            label="Notes"
            value={notes}
            onChangeText={setNotes}
            style={[styles.input, { backgroundColor: theme.colors.surface }]}
            mode="outlined"
            theme={{ colors: { primary: theme.colors.primary } }}
            multiline
          />
          <Button
            mode="contained"
            onPress={handleAddJob}
            style={styles.button}
            theme={{ colors: { primary: theme.colors.primary } }}
          >
            Add Job
          </Button>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  card: {
    padding: 20,
    borderRadius: 15,
    elevation: 5,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    padding: 10,
    borderRadius: 10,
  },
});
