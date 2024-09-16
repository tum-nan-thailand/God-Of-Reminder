// app/add-job.tsx
import { View, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function AddJobScreen() {
  const router = useRouter();
  const [company, setCompany] = useState('');
  const [position, setPosition] = useState('');
  const [status, setStatus] = useState('Applied');

  const handleSave = () => {
    // Save job logic here
    router.push('/job-list');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <TextInput placeholder="Company" value={company} onChangeText={setCompany} />
      <TextInput placeholder="Position" value={position} onChangeText={setPosition} />
      <Button title="Save Job" onPress={handleSave} />
    </View>
  );
}
