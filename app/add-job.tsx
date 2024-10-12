import React, { useState, useContext } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useTheme } from "./ThemeProvider"; // ดึงธีมจาก ThemeProvider
import { DatabaseContext } from "./DatabaseContext"; // ดึง Context สำหรับการใช้งาน Database
import { addJob } from "./sqlite/Job/JobData";
import { useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // นำเข้า DateTimePickerModal
import { Picker } from "@react-native-picker/picker"; // ใช้ Picker สำหรับการเลือกสถานะ

export default function AddJobScreen() {
  const { theme } = useTheme(); // ดึงธีมจาก Context
  const db = useContext(DatabaseContext); // ใช้ Context สำหรับ Database
  const router = useRouter();

  const [job, setJob] = useState({
    company: "",
    position: "",
    jobdate: new Date(),
    status: "",
    notes: "",
    salary: "",
    location: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleAddJob = async () => {
    if (!job.company || !job.position || !job.jobdate || !job.status) {
      Alert.alert(
        "Error",
        "Please fill in all required fields: Company, Position, Application Date, and Status."
      );
      return;
    }
    try {
      await addJob(db, job);
      Alert.alert("Success", "Job added successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
    } catch (error) {
      console.error("Failed to add job:", error);
      Alert.alert("Error", "Failed to add the job.");
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Text style={[styles.label, { color: theme.colors.text }]}>Company</Text>
      <TextInput
        mode="outlined"
        style={styles.input}
        value={job.company}
        onChangeText={(text) => setJob({ ...job, company: text })}
        placeholder="Enter company name"
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Position</Text>
      <TextInput
        mode="outlined"
        style={styles.input}
        value={job.position}
        onChangeText={(text) => setJob({ ...job, position: text })}
        placeholder="Enter position"
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>
        Application Date
      </Text>
      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        {job.jobdate.toDateString()}
      </Button>
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={(selectedDate) => {
          setShowDatePicker(false);
          setJob({ ...job, jobdate: selectedDate });
        }}
        onCancel={() => setShowDatePicker(false)}
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Status</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={job.status}
          onValueChange={(itemValue) => setJob({ ...job, status: itemValue })}
          style={{ color: theme.colors.text }}
        >
          <Picker.Item label="Select Status" value="" />
          <Picker.Item label="Applied" value="Applied" />
          <Picker.Item label="Interview" value="Interview" />
          <Picker.Item label="Offered" value="Offered" />
          <Picker.Item label="Rejected" value="Rejected" />
        </Picker>
      </View>

      <Text style={[styles.label, { color: theme.colors.text }]}>Notes</Text>
      <TextInput
        mode="outlined"
        style={styles.input}
        multiline
        numberOfLines={4}
        value={job.notes}
        onChangeText={(text) => setJob({ ...job, notes: text })}
        placeholder="Enter notes"
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Salary</Text>
      <TextInput
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
        value={job.salary}
        onChangeText={(text) => {
          const numericText = text.replace(/[^0-9]/g, "");
          const sanitizedText = Math.max(0, Number(numericText)).toString(); 
          setJob({ ...job, salary: sanitizedText });
        }}
        placeholder="Enter salary"
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>Location</Text>
      <TextInput
        mode="outlined"
        style={styles.input}
        value={job.location}
        onChangeText={(text) => setJob({ ...job, location: text })}
        placeholder="Enter location"
      />

      <Button
        mode="contained"
        onPress={handleAddJob}
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        labelStyle={{ color: theme.colors.onPrimary }}
      >
        Add Job
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    marginBottom: 15,
  },
  button: {
    marginTop: 20,
    paddingVertical: 10,
    borderRadius: 25,
  },
  dateButton: {
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 5,
    paddingVertical: 10,
  },
  pickerContainer: {
    marginBottom: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ccc",
  },
});
