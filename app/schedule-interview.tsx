import React, { useState, useContext, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, ActivityIndicator, TouchableOpacity, FlatList } from "react-native";
import { Text, Button, Card, TextInput } from "react-native-paper";
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
  const [filteredInterviews, setFilteredInterviews] = useState<JobInterface[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const initializeData = async () => {
      setIsLoading(true); 
      try {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        
        const formatDate = (date: Date) => {
          return date.toISOString().split('T')[0];
        };

        setStartDate(formatDate(firstDay));
        setEndDate(formatDate(lastDay));
        
        await fetchInterviews();
        filterByDateRange();
        setHasSearched(true);
      } catch (error) {
        console.error("Error initializing data:", error);
        Alert.alert("ข้อผิดพลาด", "ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setIsLoading(false); 
      }
    };

    initializeData();
  }, []);

  const fetchInterviews = async () => {
    try {
      const jobs = await getAllJobs(db);
      const interviewJobs = jobs
        .filter((job) => job.status === "Interview")
        .sort((a, b) => new Date(a.jobdate).getTime() - new Date(b.jobdate).getTime());

      setInterviews(interviewJobs);
      setFilteredInterviews(interviewJobs);
    } catch (error) {
      console.error("Failed to fetch interviews:", error);
      Alert.alert("ข้อผิดพลาด", "ไม่สามารถดึงข้อมูลการนัดสัมภาษณ์ได้");
    }
  };

  const filterByDateRange = async () => {
    if (!interviews.length) return;
    
    setIsLoading(true);
    try {
      setHasSearched(true);
      if (!startDate && !endDate) {
        setFilteredInterviews(interviews);
        return;
      }

      const filtered = interviews.filter((interview) => {
        const interviewDate = new Date(interview.jobdate);
        const start = startDate ? new Date(startDate + 'T00:00:00') : null;
        const end = endDate ? new Date(endDate + 'T23:59:59') : null;

        if (start && end) {
          return interviewDate >= start && interviewDate <= end;
        } else if (start) {
          return interviewDate >= start;
        } else if (end) {
          return interviewDate <= end;
        }
        return true;
      });
      setFilteredInterviews(filtered);
    } finally {
      setIsLoading(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.headerSection}>
      <View style={styles.headerContainer}>
        <MaterialIcons name="event" size={24} color={theme.colors.primary} style={styles.headerIcon} />
        <Text style={[styles.header, { color: theme.colors.text }]}>
          การนัดสัมภาษณ์ที่กำลังจะมาถึง
        </Text>
      </View>

      <Card style={styles.filterCard}>
        <Card.Content>
          <TextInput
            mode="outlined"
            label="วันที่เริ่มต้น"
            value={startDate}
            onChangeText={setStartDate}
            style={styles.dateInput}
            placeholder="YYYY-MM-DD"
            dense
            outlineColor={theme.colors.primary}
          />
          <TextInput
            mode="outlined"
            label="วันที่สิ้นสุด"
            value={endDate}
            onChangeText={setEndDate}
            style={styles.dateInput}
            placeholder="YYYY-MM-DD"
            dense
            outlineColor={theme.colors.primary}
          />
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
    </View>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
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
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {renderHeader()}
      </View>
    );
  }

  if (hasSearched && filteredInterviews.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {renderHeader()}
        <View style={styles.emptyStateContainer}>
          <MaterialIcons
            name="event-busy"
            size={64}
            color={theme.colors.primary}
            style={styles.emptyStateIcon}
          />
          <Text style={[styles.emptyText, { color: theme.colors.text }]}>
            ไม่พบการนัดสัมภาษณ์ในช่วงเวลาที่เลือก
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}
      <FlatList
        data={filteredInterviews}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("edit-job", { jobId: item.id })}
          >
            <Card
              style={[styles.card, { backgroundColor: theme.colors.surface }]}
            >
              <Card.Content>
                <View style={styles.rowContainer}>
                  <MaterialIcons
                    name="business"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text style={[styles.companyText, { color: theme.colors.text }]}>
                    {item.company}
                  </Text>
                </View>

                <View style={styles.rowContainer}>
                  <MaterialIcons
                    name="work"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text style={[styles.positionText, { color: theme.colors.text }]}>
                    {item.position}
                  </Text>
                </View>

                <View style={styles.rowContainer}>
                  <MaterialIcons
                    name="event"
                    size={24}
                    color={theme.colors.primary}
                  />
                  <Text style={[styles.dateText, { color: theme.colors.text }]}>
                    วันที่: {item.jobdate}
                  </Text>
                </View>

                {item.location && (
                  <View style={styles.rowContainer}>
                    <MaterialIcons
                      name="location-on"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text style={[styles.locationText, { color: theme.colors.text }]}>
                      สถานที่: {item.location}
                    </Text>
                  </View>
                )}

                {item.notes && (
                  <View style={styles.notesContainer}>
                    <MaterialIcons
                      name="notes"
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text style={[styles.notesText, { color: theme.colors.text }]}>
                      หมายเหตุ: {item.notes}
                    </Text>
                  </View>
                )}
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
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  headerIcon: {
    marginRight: 8,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
  },
  card: {
    marginVertical: 8,
    marginHorizontal: 4,
    borderRadius: 12,
    elevation: 4,
  },
  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  companyText: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 12,
  },
  positionText: {
    fontSize: 16,
    marginLeft: 12,
  },
  dateText: {
    fontSize: 14,
    marginLeft: 12,
  },
  locationText: {
    fontSize: 14,
    marginLeft: 12,
  },
  notesContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },
  notesText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
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
    backgroundColor: 'transparent',
  },
  headerSection: {
    marginBottom: 12,
  },
  filterCard: {
    marginHorizontal: 8,
    marginBottom: 16,
    elevation: 2,
    borderRadius: 8,
  },
  dateInput: {
    marginBottom: 8,
    backgroundColor: 'transparent',
    fontSize: 16,
  },
  filterButton: {
    marginTop: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  buttonLabel: {
    fontSize: 16,
    paddingVertical: 2,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -50,
  },
  emptyStateIcon: {
    marginBottom: 12,
    opacity: 0.9,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    opacity: 0.8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
});
