import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { useTheme } from "./ThemeProvider"; // ดึงธีมจาก ThemeProvider
import { DatabaseContext } from "./DatabaseContext"; // ดึง Context สำหรับการใช้งาน Database
import { getJobById, updateJob } from "./sqlite/Job/JobData";
import { useRouter } from "expo-router";
import DateTimePickerModal from "react-native-modal-datetime-picker"; // นำเข้า DateTimePickerModal
import { Picker } from "@react-native-picker/picker"; // ใช้ Picker สำหรับการเลือกสถานะ
import { useLocalSearchParams } from "expo-router";
import { showMessage } from "react-native-flash-message";

export default function EditJobScreen() {
  const { jobId } = useLocalSearchParams();
  const { theme } = useTheme(); // ดึงธีมจาก Context
  const router = useRouter();
  const db = useContext(DatabaseContext); // ใช้ Context สำหรับการ Database
  const [job, setJob] = useState({
    company: "",
    position: "",
    jobdate: "",
    status: "",
    notes: "",
    salary: "",
    location: "",
  });
  const [showDatePicker, setShowDatePicker] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const fetchedJob = await getJobById(db, jobId);
        setJob({
          ...fetchedJob,
          jobdate: fetchedJob.jobdate ? new Date(fetchedJob.jobdate) : "",
        });
      } catch (error) {
        console.error("Failed to fetch job:", error);
      }
    };

    fetchJob();
  }, [jobId]);

  const handleUpdateJob = async () => {
    if (!job.company || !job.position || !job.jobdate || !job.status) {
      showMessage({
        message: "ข้อผิดพลาด",
        description:
          "กรุณากรอกข้อมูลที่จำเป็นให้ครบ: ชื่อบริษัท, ตำแหน่ง, วันที่สมัคร, และสถานะ",
        type: "danger",
        icon: "auto",
      });
      return;
    }
    try {
      await updateJob(db, jobId, job);
      showMessage({
        message: "สำเร็จ",
        description: "อัปเดตงานเรียบร้อยแล้ว!",
        type: "success",
        icon: "auto",
      });
      router.push("/");
    } catch (error) {
      console.error("Failed to update job:", error);
      showMessage({
        message: "ข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตงานได้",
        type: "danger",
        icon: "auto",
      });
    }
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.colors.background },
      ]}
    >
      <Text style={[styles.label, { color: theme.colors.text }]}>
        ชื่อบริษัท
      </Text>
      <TextInput
        mode="outlined"
        style={styles.input}
        value={job.company}
        onChangeText={(text) => setJob({ ...job, company: text })}
        placeholder="ระบุชื่อบริษัท"
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>ตำแหน่ง</Text>
      <TextInput
        mode="outlined"
        style={styles.input}
        value={job.position}
        onChangeText={(text) => setJob({ ...job, position: text })}
        placeholder="ระบุตำแหน่งงาน"
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>
        วันที่สมัคร
      </Text>
      <Button
        mode="outlined"
        onPress={() => setShowDatePicker(true)}
        style={styles.dateButton}
      >
        {job.jobdate
          ? new Date(job.jobdate).toLocaleDateString()
          : "เลือกวันที่"}
      </Button>
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        date={job.jobdate ? new Date(job.jobdate) : new Date()}
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

      <Text style={[styles.label, { color: theme.colors.text }]}>
        เงินเดือน
      </Text>
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
        placeholder="ระบุเงินเดือน"
      />

      <Text style={[styles.label, { color: theme.colors.text }]}>
        สถานที่ทำงาน
      </Text>
      <TextInput
        mode="outlined"
        style={styles.input}
        value={job.location}
        onChangeText={(text) => setJob({ ...job, location: text })}
        placeholder="ระบุสถานที่ทำงาน"
      />

      <Button
        mode="contained"
        onPress={handleUpdateJob}
        style={[styles.button, { backgroundColor: theme.colors.primary }]}
        labelStyle={{ color: theme.colors.onPrimary }}
      >
        อัปเดตงาน
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
