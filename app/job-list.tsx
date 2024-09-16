// app/job-list.tsx
import { View, Text, FlatList, Button } from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';

export default function JobListScreen() {
  const router = useRouter();
  const [jobs, setJobs] = React.useState([
    { id: '1', company: 'Company A', position: 'Developer', status: 'Applied' },
    { id: '2', company: 'Company B', position: 'Designer', status: 'Interviewed' },
  ]);

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24, marginBottom: 16 }}>Job Applications</Text>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1 }}>
            <Text>{item.company} - {item.position}</Text>
            <Button title="View Details" onPress={() => router.push(`/job-detail?id=${item.id}`)} />
          </View>
        )}
      />
      <Button title="Add New Job" onPress={() => router.push('/add-job')} />
    </View>
  );
}
