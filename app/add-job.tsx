import React, { useState, useContext } from 'react';
import { View, Button, TextInput } from 'react-native';
import { DatabaseContext } from './DatabaseContext'; // ใช้ Context หากต้องการเข้าถึง db ทั่วแอป
import { addJob } from './database'; // Import ฟังก์ชันเพิ่มข้อมูล

export default function AddJobScreen() {
  const [value, setValue] = useState('');
  const [intValue, setIntValue] = useState('');
  const db = useContext(DatabaseContext);

  const handleAddJob = async () => {
    await addJob(db, value, parseInt(intValue, 10)); // ใช้ addJob จาก database.ts
  };

  return (
    <View>
      <TextInput placeholder="Value" value={value} onChangeText={setValue} />
      <TextInput placeholder="Int Value" value={intValue} onChangeText={setIntValue} keyboardType="numeric" />
      <Button title="Add Job" onPress={handleAddJob} />
    </View>
  );
}
