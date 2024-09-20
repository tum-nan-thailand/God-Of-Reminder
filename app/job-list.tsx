// job-list.tsx
import React, { useEffect, useState, useContext } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { DatabaseContext } from './DatabaseContext';
import { getAllJobs } from './database';

export default function JobListScreen() {
  const [jobs, setJobs] = useState([]);
  const db = useContext(DatabaseContext);

  useEffect(() => {
    const fetchJobs = async () => {
      const jobList = await getAllJobs(db);
      setJobs(jobList);
    };

    fetchJobs();
  }, [db]);

  if (jobs.length === 0) {
    return <Text style={styles.emptyText}>No jobs found. Add some jobs!</Text>;
  }

  return (
    <FlatList
      data={jobs}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <Card style={styles.card}>
          <Card.Title title={item.position} subtitle={item.company} />
          <Card.Content>
            <Text>Status: {item.status}</Text>
            <Text>Applied on: {item.applicationDate}</Text>
            {item.notes ? <Text>Notes: {item.notes}</Text> : null}
          </Card.Content>
          <Card.Actions>
            <Button>Edit</Button>
            <Button>Delete</Button>
          </Card.Actions>
        </Card>
      )}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    margin: 10,
    padding: 10,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 18,
    color: '#999',
  },
});
