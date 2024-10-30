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
        return "";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "#2196F3";  // น้ำเงิน
      case "Interview":
        return "#FF9800";  // ส้ม
      case "Offered":
        return "#4CAF50";  // เขียว
      case "Rejected":
        return "#F44336";  // แดง
      default:
        return "#9E9E9E";  // เทา
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
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
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color={theme.colors.primary} />
        <TextInput
          style={[styles.searchInput, { color: theme.colors.text }]}
          placeholder="ค้นหาตำแหน่งงาน หรือ บริษัท..."
          placeholderTextColor={theme.colors.placeholder}
          value={searchTerm}
          onChangeText={handleSearch}
        />
      </View>

      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("edit-job", { jobId: item.id })}
            style={styles.cardContainer}
          >
            <Card style={[styles.card, { elevation: 4 }]}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.jobHeader}>
                  <View style={styles.jobTitleContainer}>
                    <Text style={[styles.positionText, { fontSize: 20 }]} numberOfLines={1}>
                      {item.position}
                    </Text>
                    <View style={styles.companyContainer}>
                      <MaterialIcons name="business" size={16} color="#7f8c8d" />
                      <Text style={[styles.companyText, { marginLeft: 4 }]} numberOfLines={1}>
                        {item.company}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.rightContainer}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) }
                    ]}>
                      <Text style={[styles.statusText, { fontSize: 13 }]}>
                        {getStatusLabel(item.status)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.detailsContainer, { marginTop: 12 }]}>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="event" size={18} color="#3498db" />
                    <Text style={[styles.detailText, { color: '#2c3e50' }]}>
                      {formatDate(item.jobdate)}
                    </Text>
                  </View>
                  
                  {item.salary && (
                    <View style={styles.detailRow}>
                      <MaterialIcons name="attach-money" size={18} color="#2ecc71" />
                      <Text style={[styles.detailText, { color: '#2c3e50' }]}>
                        {Number(item.salary).toLocaleString()} บาท
                      </Text>
                    </View>
                  )}
                  
                  {item.location && (
                    <View style={styles.detailRow}>
                      <MaterialIcons name="location-on" size={18} color="#e74c3c" />
                      <Text style={[styles.detailText, { color: '#2c3e50' }]}>
                        {item.location}
                      </Text>
                    </View>
                  )}
                </View>
                
                <TouchableOpacity
                  style={[styles.deleteButton, { position: 'absolute', right: 8, bottom: 8 }]}
                  onPress={() => handleDeleteJob(item.id)}
                >
                  <MaterialIcons name="delete-outline" size={22} color="#e74c3c" />
                </TouchableOpacity>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 60,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  cardContainer: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    backgroundColor: '#fff',
    marginHorizontal: 2,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardContent: {
    padding: 16,
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  jobTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  rightContainer: {
    alignItems: 'flex-end',
  },
  positionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  companyText: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 4,
    marginBottom: 8,
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    marginTop: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#34495e',
  },
  listContainer: {
    paddingBottom: 16,
  },
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
});