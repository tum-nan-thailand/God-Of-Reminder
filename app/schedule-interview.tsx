// app/schedule-interview.tsx
import { View, Text, TextInput, Button } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function ScheduleInterviewScreen() {
  const router = useRouter();
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSchedule = () => {
    // Schedule interview logic here
    router.push('/job-list');
  };

  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Text>Schedule Interview</Text>
      <TextInput placeholder="Date" value={date} onChangeText={setDate} />
      <TextInput placeholder="Time" value={time} onChangeText={setTime} />
      <Button title="Schedule" onPress={handleSchedule} />
    </View>
  );
}
