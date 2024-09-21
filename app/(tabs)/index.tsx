import React from 'react';
import { View, StyleSheet, ImageBackground } from 'react-native';
import { Text, Button, Card, Title, Paragraph } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground 
      source={{ uri: 'https://www.transparenttextures.com/patterns/connected.png' }} 
      style={styles.backgroundImage}
    >
      <LinearGradient 
        colors={['#fa9c3efd', '#f4941d']} // เปลี่ยนเป็นโทนสีส้มที่เข้มกว่าเล็กน้อยเพื่อความสวยงาม
        style={styles.overlay}
      >
        <View style={styles.headerContainer}>
          <MaterialIcons name="work-outline" size={48} color="#ffffff" />
          <Title style={styles.title}>Job Tracker App</Title>
          <Paragraph style={styles.subtitle}>Manage your job applications effectively</Paragraph>
        </View>
        
        <View style={styles.container}>
          <View style={styles.cardContainer}>
            <Card style={styles.card} onPress={() => router.push('/job-list')}>
              <Card.Content style={styles.cardContent}>
                <MaterialIcons name="folder-open" size={48} color="#fa9c3e" style={styles.cardIcon} />
                <View style={styles.cardTextContainer}>
                  <Title style={styles.cardTitle}>Job Applications</Title>
                  <Paragraph style={styles.cardText}>View and manage your job applications</Paragraph>
                </View>
                <Button mode="contained" style={styles.button}>View</Button>
              </Card.Content>
            </Card>

            <Card style={styles.card} onPress={() => router.push('/add-job')}>
              <Card.Content style={styles.cardContent}>
                <MaterialIcons name="add-circle-outline" size={48} color="#fa9c3e" style={styles.cardIcon} />
                <View style={styles.cardTextContainer}>
                  <Title style={styles.cardTitle}>Add New Job</Title>
                  <Paragraph style={styles.cardText}>Register a new job application</Paragraph>
                </View>
                <Button mode="contained" style={styles.button}>Add</Button>
              </Card.Content>
            </Card>

            <Card style={styles.card} onPress={() => router.push('/schedule-interview')}>
              <Card.Content style={styles.cardContent}>
                <MaterialIcons name="schedule" size={48} color="#fa9c3e" style={styles.cardIcon} />
                <View style={styles.cardTextContainer}>
                  <Title style={styles.cardTitle}>Schedule Interview</Title>
                  <Paragraph style={styles.cardText}>Track your interview schedules</Paragraph>
                </View>
                <Button mode="contained" style={styles.button}>Track</Button>
              </Card.Content>
            </Card>
          </View>
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  overlay: {
    flex: 1,
  },
  headerContainer: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fa9c3e', // เปลี่ยนสีของส่วนหัวให้เข้ากับโทนสีที่ใช้ในแอป
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'center',
    color: '#ffffff',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#ffffff',
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 10,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 5,
  },
  cardContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    marginBottom: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 5,
    backgroundColor: '#fff',
    marginHorizontal: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  cardTextContainer: {
    flex: 1,
    marginHorizontal: 10,
  },
  cardIcon: {
    marginRight: 15,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  cardText: {
    fontSize: 16,
    color: '#666',
  },
  button: {
    borderRadius: 25,
    marginVertical: 10,
    backgroundColor: '#fa9c3e', // เปลี่ยนสีปุ่มเป็นสีส้มเข้ม
  },
});
