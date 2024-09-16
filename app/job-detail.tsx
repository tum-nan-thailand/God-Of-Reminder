// app/job-detail.tsx
import { View, Text, Button } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function JobDetailScreen() {
  const { id } = useLocalSearchParams();  // แก้ไขตรงนี้
  const router = useRouter();

  // Fetch job details using ID logic here

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text style={{ fontSize: 24 }}>Job Detail for ID: {id}</Text>
      <Button title="Back to List" onPress={() => router.push('/job-list')} />
    </View>
  );
}
