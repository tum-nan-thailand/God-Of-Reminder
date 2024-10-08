import React, { useState, useContext } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useTheme } from './ThemeProvider'; // ดึงธีมจาก ThemeProvider
import { DatabaseContext } from './DatabaseContext'; // ดึง Context สำหรับการใช้งาน Database
import { addJob } from './database'; // ฟังก์ชันสำหรับการเพิ่มข้อมูลลงฐานข้อมูล
import { useRouter } from 'expo-router';

export default function AddJobScreen() {
  const { theme } = useTheme(); // ดึงธีมจาก Context
  const db = useContext(DatabaseContext); // ใช้ Context สำหรับ Database
  const router = useRouter();

  const [job, setJob] = useState({
    company: '',
    position: '',
    applicationDate: '',
    status: '',
    notes: '',
    salary: '',
    location: '',
  });

  const handleAddJob = async () => {
    if (!job.company || !job.position || !job.applicationDate || !job.status) {
      Alert.alert('Error', 'Please fill in all required fields: Company, Position, Application Date, and Status.');
      return;
    }
    try {
      await addJob(db, job);
      Alert.alert('Success', 'Job added successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      console.error('Failed to add job:', error);
      Alert.alert('Error', 'Failed to add the job.');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.label, { color: theme.colors.text }]}>Company</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.primary }]}
        value={job.company}
        onChangeText={(text) => setJob({ ...job, company: text })}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Position</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.primary }]}
        value={job.position}
        onChangeText={(text) => setJob({ ...job, position: text })}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Application Date</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.primary }]}
        value={job.applicationDate}
        onChangeText={(text) => setJob({ ...job, applicationDate: text })}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Status</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.primary }]}
        value={job.status}
        onChangeText={(text) => setJob({ ...job, status: text })}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Notes</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.primary }]}
        value={job.notes}
        onChangeText={(text) => setJob({ ...job, notes: text })}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Salary</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.primary }]}
        value={job.salary}
        onChangeText={(text) => setJob({ ...job, salary: text })}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Location</Text>
      <TextInput
        style={[styles.input, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.primary }]}
        value={job.location}
        onChangeText={(text) => setJob({ ...job, location: text })}
      />

      <Button
        mode="contained"
        onPress={handleAddJob}
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        labelStyle={{ color: theme.colors.onPrimary }}
      >
        Add Job
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    padding: 10,
    marginBottom: 15,
    borderRadius: 10,
    borderWidth: 1,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
});