import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useTheme } from "./ThemeProvider";
import { DatabaseContext } from "./DatabaseContext";
import { getJobById } from "./sqlite/Job/JobData";
import { useLocalSearchParams } from "expo-router";

export default function JobDetailScreen() {
  const { jobId } = useLocalSearchParams();
  const { theme } = useTheme();
  const db = useContext(DatabaseContext);
  const [job, setJob] = useState({
    company: "",
    position: "",
    jobdate: "",
    status: "",
    notes: "",
    salary: "",
    location: "",
  });

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const fetchedJob = await getJobById(db, jobId);
        setJob({
          ...fetchedJob,
          jobdate: fetchedJob.jobdate
            ? new Date(fetchedJob.jobdate).toLocaleDateString()
            : "",
        });
      } catch (error) {
        console.error("Failed to fetch job:", error);
      }
    };

    fetchJob();
  }, [jobId]);

  if (!job.company) return <Text>Loading...</Text>;

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <View style={styles.row}>
        <MaterialIcons name="business" size={24} color={theme.colors.primary} />
        <Text style={[styles.label, { color: theme.colors.primary }]}>
          ชื่อบริษัท
        </Text>
      </View>
      <Text style={[styles.value, { color: theme.colors.secondary }]}>
        {job.company}
      </Text>

      <View style={styles.row}>
        <MaterialIcons name="work" size={24} color={theme.colors.primary} />
        <Text style={[styles.label, { color: theme.colors.primary }]}>
          ตำแหน่ง
        </Text>
      </View>
      <Text style={[styles.value, { color: theme.colors.secondary }]}>
        {job.position}
      </Text>

      <View style={styles.row}>
        <MaterialIcons name="event" size={24} color={theme.colors.primary} />
        <Text style={[styles.label, { color: theme.colors.primary }]}>
          วันที่สมัคร
        </Text>
      </View>
      <Text style={[styles.value, { color: theme.colors.secondary }]}>
        {job.jobdate}
      </Text>

      <View style={styles.row}>
        <MaterialIcons name="info" size={24} color={theme.colors.primary} />
        <Text style={[styles.label, { color: theme.colors.primary }]}>
          สถานะ
        </Text>
      </View>
      <Text style={[styles.value, { color: theme.colors.secondary }]}>
        {job.status}
      </Text>

      <View style={styles.row}>
        <MaterialIcons name="note" size={24} color={theme.colors.primary} />
        <Text style={[styles.label, { color: theme.colors.primary }]}>
          หมายเหตุ
        </Text>
      </View>
      <Text style={[styles.value, { color: theme.colors.secondary }]}>
        {job.notes}
      </Text>

      <View style={styles.row}>
        <MaterialIcons
          name="attach-money"
          size={24}
          color={theme.colors.primary}
        />
        <Text style={[styles.label, { color: theme.colors.primary }]}>
          เงินเดือน
        </Text>
      </View>
      <Text style={[styles.value, { color: theme.colors.secondary }]}>
        {job.salary}
      </Text>

      <View style={styles.row}>
        <MaterialIcons
          name="location-on"
          size={24}
          color={theme.colors.primary}
        />
        <Text style={[styles.label, { color: theme.colors.primary }]}>
          สถานที่ทำงาน
        </Text>
      </View>
      <Text style={[styles.value, { color: theme.colors.secondary }]}>
        {job.location}
      </Text>

      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialIcons name="edit" size={20} color="#FFFFFF" />
          <Text style={styles.menuButtonText}>แก้ไข</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialIcons name="delete" size={20} color="#FFFFFF" />
          <Text style={styles.menuButtonText}>ลบ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuButton}>
          <MaterialIcons name="share" size={20} color="#FFFFFF" />
          <Text style={styles.menuButtonText}>แชร์</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#6200EE",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  menuButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  menuContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  container: {
    flexGrow: 1,
    padding: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  value: {
    fontSize: 16,
    marginBottom: 15,
  },
});
