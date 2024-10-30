import React, { useState, useContext, useEffect } from "react";
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { Text, Button, Card, TextInput } from "react-native-paper";
import DateTimePicker from '@react-native-community/datetimepicker';
import { useTheme } from "./ThemeProvider";
import { DatabaseContext } from "./DatabaseContext";
import { getAllJobs } from "./sqlite/Job/JobData";
import { MaterialIcons } from "@expo/vector-icons";
import { JobInterface } from "./sqlite/Job/Job.Interface";
import { useNavigation } from "@react-navigation/native";

export default function ScheduleInterviewScreen() {
  const { theme } = useTheme();
  const db: any = useContext(DatabaseContext);
  const [interviews, setInterviews] = useState<JobInterface[]>([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filteredInterviews, setFilteredInterviews] = useState<JobInterface[]>(
    []
  );
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true);
      try {
        // ตั้งค่าวันที่เริ่มต้นเป็นเดือนปัจจุบัน
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const formatDate = (date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        setStartDate(formatDate(firstDay));
        setEndDate(formatDate(lastDay));

        // ดึงข้อมูลการสัมภาษณ์
        const jobList = await fetchInterviews();
        
        // แสดงข้อมูลทั้งหมดในครั้งแรก โดยไม่ต้องกรอง
        setFilteredInterviews(jobList);
        setHasSearched(false); // ตั้งค่าเป็น false เพื่อแสดงว่ายังไม่ได้กดค้นหา
        
      } catch (error) {
        console.error("Error initializing data:", error);
        Alert.alert("ข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, []);

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
        return "#2196F3"; // น้ำเงิน
      case "Interview":
        return "#FF9800"; // ส้ม
      case "Offered":
        return "#4CAF50"; // เขียว
      case "Rejected":
        return "#F44336"; // แดง
      default:
        return "#9E9E9E"; // เทา
    }
  };

  const fetchInterviews = async () => {
    try {
      const jobs = await getAllJobs(db);
      const interviewJobs = jobs
        .filter((job) => job.status === "Interview")
        .sort(
          (a, b) =>
            new Date(a.jobdate).getTime() - new Date(b.jobdate).getTime()
        );

      console.log('Fetched interview jobs:', interviewJobs);
      setInterviews(interviewJobs);
      setFilteredInterviews(interviewJobs);
      return interviewJobs;
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถดึงข้อมูลการนัดสัมภาษณ์ได้");
      return [];
    }
  };

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartPicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      if (endDate && formattedDate > endDate) {
        Alert.alert('ข้อผิดพลาด', 'วันที่เริ่มต้นต้องไม่มากกว่าวันที่สิ้นสุด');
        return;
      }
      setStartDate(formattedDate);
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndPicker(false);
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      if (startDate && formattedDate < startDate) {
        Alert.alert('ข้อผิดพลาด', 'วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น');
        return;
      }
      setEndDate(formattedDate);
    }
  };

  const filterByDateRange = async () => {
    if (!interviews.length) return;

    setIsLoading(true);
    try {
      setHasSearched(true);
      
      console.log('Filtering with dates:', {
        start: startDate,
        end: endDate,
        interviews: interviews
      });

      const filtered = interviews.filter((interview) => {
        const interviewDate = interview.jobdate.split('T')[0];
        
        if (startDate && endDate) {
          return interviewDate >= startDate && interviewDate <= endDate;
        } else if (startDate) {
          return interviewDate >= startDate;
        } else if (endDate) {
          return interviewDate <= endDate;
        }
        
        return true;
      });

      console.log('Filtered results:', filtered);
      setFilteredInterviews(filtered);
    } catch (error) {
      console.error('Error filtering interviews:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <View style={styles.headerContainer}>
        <MaterialIcons
          name="event"
          size={24}
          color={theme.colors.primary}
          style={styles.headerIcon}
        />
        <Text style={[styles.header, { color: theme.colors.text }]}>
          การนัดสัมภาษณ์ที่กำลังจะมาถึง
        </Text>
      </View>

      <Card style={styles.filterCard}>
        <Card.Content>
          <View style={styles.dateInputContainer}>
            <Text style={styles.dateLabel}>วันที่เริ่มต้น</Text>
            <TouchableOpacity
              onPress={() => setShowStartPicker(true)}
              style={styles.dateInputWrapper}
            >
              <MaterialIcons 
                name="calendar-today" 
                size={20} 
                color={theme.colors.primary}
                style={styles.calendarIcon}
              />
              <Text style={styles.dateText}>
                {startDate ? formatDisplayDate(startDate) : 'เลือกวันที่'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateInputContainer}>
            <Text style={styles.dateLabel}>วันที่สิ้นสุด</Text>
            <TouchableOpacity
              onPress={() => setShowEndPicker(true)}
              style={styles.dateInputWrapper}
            >
              <MaterialIcons 
                name="calendar-today" 
                size={20} 
                color={theme.colors.primary}
                style={styles.calendarIcon}
              />
              <Text style={styles.dateText}>
                {endDate ? formatDisplayDate(endDate) : 'เลือกวันที่'}
              </Text>
            </TouchableOpacity>
          </View>

          <Button
            mode="contained"
            onPress={filterByDateRange}
            style={styles.filterButton}
            labelStyle={styles.buttonLabel}
          >
            ค้นหา
          </Button>
        </Card.Content>
      </Card>

      {showStartPicker && (
        <DateTimePicker
          value={startDate ? new Date(startDate) : new Date()}
          mode="date"
          display="default"
          onChange={handleStartDateChange}
        />
      )}

      {showEndPicker && (
        <DateTimePicker
          value={endDate ? new Date(endDate) : new Date()}
          mode="date"
          display="default"
          onChange={handleEndDateChange}
        />
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={[styles.loadingText, { color: theme.colors.text }]}>
            กำลังโหลดข้อมูล...
          </Text>
        </View>
      </View>
    );
  }

  if (!hasSearched) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {renderHeader()}
      </View>
    );
  }

  if (hasSearched && filteredInterviews.length === 0) {
    return (
      <View
        style={[styles.container, { backgroundColor: theme.colors.background }]}
      >
        {renderHeader()}
        <View style={styles.emptyStateContainer}>
          <MaterialIcons
            name="search-off"
            size={64}
            color={theme.colors.primary}
            style={styles.emptyStateIcon}
          />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            ไม่พบการนัดสัมภาษณ์ในช่วงเวลาที่เลือก
          </Text>
          <Text style={[styles.emptySubText, { color: theme.colors.text }]}>
            ลองเปลี่ยนช่วงเวลาในการค้นหา
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      {renderHeader()}
      <FlatList
        data={filteredInterviews}
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
                    <Text style={[styles.positionText]} numberOfLines={1}>
                      {item.position}
                    </Text>
                    <View style={styles.companyContainer}>
                      <MaterialIcons name="business" size={16} color="#7f8c8d" />
                      <Text style={[styles.companyText]} numberOfLines={1}>
                        {item.company}
                      </Text>
                    </View>
                  </View>
                  
                  <View style={styles.rightContainer}>
                    <View style={[
                      styles.statusBadge,
                      { backgroundColor: getStatusColor(item.status) }
                    ]}>
                      <Text style={styles.statusText}>
                        {getStatusLabel(item.status)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.detailsContainer}>
                  <View style={styles.detailRow}>
                    <MaterialIcons name="event" size={18} color="#3498db" />
                    <Text style={styles.detailText}>
                      {item.jobdate}
                    </Text>
                  </View>
                  
                  {item.location && (
                    <View style={styles.detailRow}>
                      <MaterialIcons name="location-on" size={18} color="#e74c3c" />
                      <Text style={styles.detailText}>
                        {item.location}
                      </Text>
                    </View>
                  )}

                  {item.notes && (
                    <View style={styles.detailRow}>
                      <MaterialIcons name="notes" size={18} color="#2ecc71" />
                      <Text style={styles.detailText}>
                        {item.notes}
                      </Text>
                    </View>
                  )}
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerIcon: {
    marginRight: 8,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
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
  companyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  companyText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginLeft: 4,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    marginTop: "20%",
  },
  searchInput: {
    marginBottom: 20,
    backgroundColor: "transparent",
  },
  headerSection: {
    marginBottom: 16,
  },
  filterCard: {
    elevation: 2,
    borderRadius: 12,
    backgroundColor: '#fff',
  },
  dateInputContainer: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  dateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  calendarIcon: {
    marginRight: 8,
  },
  dateText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  filterButton: {
    marginTop: 8,
    borderRadius: 8,
    elevation: 2,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    paddingVertical: 4,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyStateIcon: {
    marginBottom: 16,
    opacity: 0.9,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: 'center',
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
  },
});
