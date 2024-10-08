import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, TextInput, ScrollView, Alert } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useTheme } from './ThemeProvider'; // ดึงธีมจาก ThemeProvider
import { DatabaseContext } from './DatabaseContext'; // ดึง Context สำหรับการใช้งาน Database
import { getJobById, updateJob } from './database'; // ฟังก์ชันสำหรับดึงและอัปเดตข้อมูลจากฐานข้อมูล

import { useLocalSearchParams } from "expo-router";

export default function EditJobScreen() {
  const { jobId } = useLocalSearchParams();
  const { theme } = useTheme(); // ดึงธีมจาก Context
  const db = useContext(DatabaseContext); // ใช้ Context สำหรับ Database

  const [job, setJob] = useState({
    company: '',
    position: '',
    applicationDate: '',
    status: '',
    notes: '',
    salary: '',
    location: '',
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const fetchedJob = await getJobById(db, jobId);
        setJob(fetchedJob);
      } catch (error) {
        console.error('Failed to fetch job:', error);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleUpdateJob = async () => {
    try {
      await updateJob(db, jobId, job);
      Alert.alert('Success', 'Job updated successfully!', [{ text: 'OK', onPress: () => navigation.goBack() }]);
    } catch (error) {
      console.error('Failed to update job:', error);
      Alert.alert('Error', 'Failed to update the job.');
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
        onPress={handleUpdateJob}
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        labelStyle={{ color: theme.colors.onPrimary }}
      >
        Update Job
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