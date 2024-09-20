import React, { useEffect, useState, useContext } from 'react';
import { View, Text } from 'react-native';
import { DatabaseContext } from './DatabaseContext';
import { getFirstJob } from './database';

export default function JobDetailScreen() {
  const [job, setJob] = useState(null);
  const db = useContext(DatabaseContext);

  useEffect(() => {
    const fetchJob = async () => {
      const jobDetail = await getFirstJob(db);
      setJob(jobDetail);
    };

    fetchJob();
  }, []);

  if (!job) return <Text>Loading...</Text>;

  return (
    <View>
      <Text>Job ID: {job.id}</Text>
      <Text>Value: {job.value}</Text>
      <Text>Int Value: {job.intValue}</Text>
    </View>
  );
}
