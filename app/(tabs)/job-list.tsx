import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { Card } from "react-native-paper";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { DatabaseContext } from "../DatabaseContext";
import { useTheme } from "../ThemeProvider";
import { useNavigation } from "@react-navigation/native";
import { getAllJobs, deleteJob } from "../sqlite/Job/JobData";
import { JobInterface } from "../sqlite/Job/Job.Interface";
import { showMessage } from "react-native-flash-message";

export default function JobListScreen() {
  const [jobs, setJobs] = useState<JobInterface[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredJobs, setFilteredJobs] = useState<JobInterface[]>([]);
  const db: any = useContext(DatabaseContext);
  const { theme } = useTheme();
  const navigation = useNavigation();

  useEffect(() => {
    fetchJobs();
  }, [db]);

  const fetchJobs = async () => {
    try {
      const jobList = await getAllJobs(db);
      setJobs(jobList);
      setFilteredJobs(jobList);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  const handleSearch = (text: string) => {
    setSearchTerm(text);

    if (text === "") {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(
        (job) =>
          job.position.toLowerCase().includes(text.toLowerCase()) ||
          job.company.toLowerCase().includes(text.toLowerCase()) ||
          job.status.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredJobs(filtered);
    }
  };

  const handleDeleteJob = async (jobId: number) => {
    try {
      await deleteJob(db, jobId);
      showMessage({
        message: "สำเร็จ",
        description: "ลบงานเรียบร้อยแล้ว!",
        type: "success",
        icon: "auto",
      });
      fetchJobs();
    } catch (error) {
      console.error("Failed to delete job:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถลบงานได้");
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "Applied":
        return "สมัครแล้ว";
      case "Interview":
        return "สัมภาษณ์"; 
      case "Offered":
        return "ได้รับข้อเสนอ";
      case "Rejected":
        return "ถูกปฏิเสธ";
      default:
        return "เลือกสถานะ";
    }
  };

  if (jobs.length === 0) {
    return (
      <View
        style={[
          styles.emptyContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <Text style={[styles.emptyText, { color: theme.colors.text }]}>
          ไม่พบงานที่บันทึกไว้ กรุณาเพิ่มงานใหม่!
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <TextInput
        style={[
          styles.searchInput,
          {
            backgroundColor: theme.colors.card,
            color: theme.colors.text,
            borderColor: theme.colors.primary,
          },
        ]}
        placeholder="ค้นหางาน..."
        placeholderTextColor={theme.colors.placeholder}
        value={searchTerm}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("edit-job", { jobId: item.id })}
          >
            <Card
              style={[
                styles.card,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.primary,
                  borderWidth: 1,
                },
              ]}
            >
              <TouchableOpacity
                style={styles.deleteIcon}
                onPress={() => handleDeleteJob(item.id)}
              >
                <MaterialIcons
                  name="close"
                  size={24}
                  color={theme.colors.error}
                />
              </TouchableOpacity>
              <Card.Title
                title={
                  <View style={styles.titleContainer}>
                    <FontAwesome
                      name="briefcase"
                      size={20}
                      color={theme.colors.primary}
                      style={styles.iconSpacing}
                    />
                    <Text style={styles.titleText}>{item.position}</Text>
                  </View>
                }
                subtitle={
                  <View style={styles.subtitleContainer}>
                    <MaterialIcons
                      name="business"
                      size={18}
                      color={theme.colors.textSecondary}
                      style={styles.iconSpacing}
                    />
                    <Text style={styles.subtitleText}>
                      บริษัท: {item.company}
                    </Text>
                  </View>
                }
              />
              <Card.Content>
                <View style={styles.cardContentRow}>
                  <View style={styles.iconSpacing}>
                    <MaterialIcons
                      name="info"
                      size={18}
                      color={theme.colors.primary}
                    />
                    <Text
                      style={[
                        styles.text,
                        { color: theme.colors.text },
                        { marginLeft: 5 },
                      ]}
                    >
                      สถานะ:
                    </Text>
                  </View>
                  <Text
                    style={[styles.textValue, { color: theme.colors.primary }]}
                  >
                    {getStatusLabel(item.status)}
                  </Text>
                </View>
                <View style={styles.cardContentRow}>
                  <View style={styles.iconSpacing}>
                    <MaterialIcons
                      name="calendar-today"
                      size={18}
                      color={theme.colors.primary}
                    />
                    <Text
                      style={[
                        styles.text,
                        { color: theme.colors.text },
                        { marginLeft: 5 },
                      ]}
                    >
                      วันที่สมัคร:
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.textValue,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {item.jobdate}
                  </Text>
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
        style={{ backgroundColor: theme.colors.background }}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: "10%",
  },
  searchInput: {
    padding: 12,
    marginBottom: 20,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: "#ff9800",
  },
  contentContainer: {
    paddingBottom: 20,
  },
  card: {
    marginVertical: 10,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    backgroundColor: "#ffffff",
    padding: 15,
    borderWidth: 1,
    borderColor: "#ff9800",
  },
  deleteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#ff9800",
    marginLeft: 8,
  },
  subtitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 3,
  },
  subtitleText: {
    fontSize: 14,
    color: "#666666",
    marginLeft: 5,
  },
  cardContentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  iconSpacing: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 3, // ลดระยะห่างระหว่างไอคอนและข้อความให้แน่นขึ้น
  },
  text: {
    fontSize: 15,
    fontWeight: "500",
    color: "#333333",
  },
  textValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#444444",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: "#555555",
  },
});
