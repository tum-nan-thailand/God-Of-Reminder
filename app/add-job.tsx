import React, { useState, useContext } from "react";
import { View, StyleSheet, FlatList, TouchableOpacity } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useTheme } from "./ThemeProvider";
import { DatabaseContext } from "./DatabaseContext";
import { addJob } from "./sqlite/Job/JobData";
import { useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Picker } from "@react-native-picker/picker";
import { showMessage } from "react-native-flash-message";

export default function AddJobScreen() {
  const { theme } = useTheme();
  const db = useContext(DatabaseContext);
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
  const [companySuggestions, setCompanySuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const companies = ["บริษัท A", "บริษัท B", "บริษัท C", "บริษัท D", "บริษัท E"];

  const handleAddJob = async () => {
    if (!job.company || !job.position || !job.jobdate || !job.status) {
      showMessage({
        message: "ข้อผิดพลาด",
        description: "กรุณากรอกข้อมูลที่จำเป็นให้ครบ: ชื่อบริษัท, ตำแหน่ง, วันที่สมัคร, และสถานะ",
        type: "danger",
        icon: "auto",
      });
      return;
    }
    try {
      await addJob(db, job);
      showMessage({
        message: "สำเร็จ",
        description: "เพิ่มงานเรียบร้อยแล้ว!",
        type: "success",
        icon: "auto",
      });
      router.push("/");
    } catch (error) {
      console.error("เพิ่มงานล้มเหลว:", error);
      showMessage({
        message: "ข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มงานได้",
        type: "danger",
        icon: "auto",
      });
    }
  };

  const handleCompanySearch = (text) => {
    setJob({ ...job, company: text });
    if (text) {
      const filteredCompanies = companies.filter((company) =>
        company.includes(text)
      );
      setCompanySuggestions(filteredCompanies);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.label, { color: theme.colors.text }]}>ชื่อบริษัท</Text>
      <TextInput
        mode="outlined"
        style={styles.input}
        value={job.company}
       
        placeholder="ระบุชื่อบริษัท"
      />
      
      {showSuggestions && (
        <FlatList
          data={companySuggestions}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setJob({ ...job, company: item });
                setShowSuggestions(false);
              }}
            >
              <Text style={styles.suggestionText}>{item}</Text>
            </TouchableOpacity>
          )}
          style={styles.suggestionsContainer}
        />
      )}

      <Text style={[styles.label, { color: theme.colors.text }]}>ตำแหน่ง</Text>
      <TextInput
        mode="outlined"
        style={styles.input}
        value={job.position}
        onChangeText={(text) => setJob({ ...job, position: text })}
        placeholder="ระบุตำแหน่งงาน"
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>วันที่สมัคร</Text>
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

      <Text style={[styles.label, { color: theme.colors.text }]}>สถานะ</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={job.status}
          onValueChange={(itemValue) => setJob({ ...job, status: itemValue })}
          style={{ color: theme.colors.text }}
        >
          <Picker.Item label="เลือกสถานะ" value="" />
          <Picker.Item label="สมัครแล้ว" value="Applied" />
          <Picker.Item label="สัมภาษณ์" value="Interview" />
          <Picker.Item label="ได้รับข้อเสนอ" value="Offered" />
          <Picker.Item label="ถูกปฏิเสธ" value="Rejected" />
        </Picker>
      </View>

      <Text style={[styles.label, { color: theme.colors.text }]}>หมายเหตุ</Text>
      <TextInput
        mode="outlined"
        style={styles.input}
        multiline
        numberOfLines={4}
        value={job.notes}
        onChangeText={(text) => setJob({ ...job, notes: text })}
        placeholder="ระบุหมายเหตุ"
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>เงินเดือน</Text>
      <TextInput
        mode="outlined"
        style={styles.input}
        keyboardType="numeric"
        value={job.salary}
        onChangeText={(text) => {
          const numericText = text.replace(/[^0-9]/g, "");
          setJob({ ...job, salary: numericText });
        }}
        placeholder="ระบุเงินเดือน"
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>สถานที่ทำงาน</Text>
      <TextInput
        mode="outlined"
        style={styles.input}
        value={job.location}
        onChangeText={(text) => setJob({ ...job, location: text })}
        placeholder="ระบุสถานที่ทำงาน"
      />

      <Button
        mode="contained"
        onPress={handleAddJob}
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        labelStyle={{ color: theme.colors.onPrimary }}
      >
        เพิ่มงาน
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  suggestionsContainer: {
    maxHeight: 150,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 15,
  },
  suggestionText: {
    padding: 10,
    fontSize: 16,
    color: "#555",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
});
