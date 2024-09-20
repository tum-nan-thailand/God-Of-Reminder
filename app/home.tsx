// home.tsx
import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Job Tracker App</Text>
      <Text style={styles.subtitle}>Manage your job applications effectively.</Text>
      <Button
        title="View Job Applications"
        onPress={() => navigation.navigate('JobList')}
      />
      <Button
        title="Add New Job"
        onPress={() => navigation.navigate('AddJob')}
        color="#007AFF"
      />
      <Button
        title="Schedule Interview"
        onPress={() => navigation.navigate('ScheduleInterview')}
        color="#34C759"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20,
  },
});
