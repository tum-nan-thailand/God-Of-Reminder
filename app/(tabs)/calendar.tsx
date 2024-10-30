import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Text, Card } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import { useTheme } from "../ThemeProvider";
import { DatabaseContext } from "../DatabaseContext";
import { getAllJobs } from "../sqlite/Job/JobData";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { JobInterface } from "../sqlite/Job/Job.Interface";

export default function CalendarScreen() {
  const { theme } = useTheme();
  const db : any = useContext(DatabaseContext);
  const router = useRouter();
  const [jobs, setJobs] = useState<JobInterface[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [markedDates, setMarkedDates] = useState({});

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const jobList = await getAllJobs(db);
      setJobs(jobList);
      const marks: Record<string, any> = {};
      jobList.forEach((job) => {
        const date = job.jobdate.split("T")[0];
        marks[date] = {
          marked: true,
          dotColor: getStatusColor(job.status),
          selected: date === selectedDate,
        };
      });
      setMarkedDates(marks);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "#2196F3";
      case "Interview":
        return "#FF9800";
      case "Offered":
        return "#4CAF50";
      case "Rejected":
        return "#F44336";
      default:
        return "#9E9E9E";
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

  const onDayPress = (day: { dateString: React.SetStateAction<string>; }) => {
    setSelectedDate(day.dateString);
    const newMarkedDates: Record<string, any> = { ...markedDates };
    Object.keys(newMarkedDates).forEach((date) => {
      newMarkedDates[date] = {
        ...newMarkedDates[date],
        selected: date === day.dateString,
      };
    });
    setMarkedDates(newMarkedDates);
  };

  const getJobsForSelectedDate = () => {
    return jobs.filter((job) => job.jobdate.split("T")[0] === selectedDate);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("th-TH", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Calendar
        onDayPress={onDayPress}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: theme.colors.primary,
          todayTextColor: theme.colors.primary,
          arrowColor: theme.colors.primary,
        }}
      />

      <View style={styles.legendContainer}>
        <Text style={[styles.legendTitle, { color: theme.colors.text }]}>
          สถานะ:
        </Text>
        <View style={styles.legendItems}>
          {["Applied", "Interview", "Offered", "Rejected"].map((status) => (
            <View key={status} style={styles.legendItem}>
              <View
                style={[
                  styles.dot,
                  { backgroundColor: getStatusColor(status) },
                ]}
              />
              <Text style={{ color: theme.colors.text }}>
                {getStatusLabel(status)}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {selectedDate && (
        <View style={styles.selectedDateContainer}>
          <Text style={[styles.selectedDateText, { color: theme.colors.text }]}>
            กิจกรรมวันที่ {formatDate(selectedDate)}
          </Text>
        </View>
      )}

      <ScrollView style={styles.jobList}>
        {getJobsForSelectedDate().map((job) => (
          <TouchableOpacity
            key={job.id}
            onPress={() => router.push(`/edit-job?jobId=${job.id}`)}
            style={styles.cardContainer}
          >
            <Card style={[styles.card, { elevation: 4 }]}>
              <Card.Content style={styles.cardContent}>
                <View style={styles.jobHeader}>
                  <View style={styles.jobTitleContainer}>
                    <Text
                      style={[styles.positionText, { fontSize: 20 }]}
                      numberOfLines={1}
                    >
                      {job.position}
                    </Text>
                    <View style={styles.companyContainer}>
                      <MaterialIcons
                        name="business"
                        size={16}
                        color="#7f8c8d"
                      />
                      <Text
                        style={[styles.companyText, { marginLeft: 4 }]}
                        numberOfLines={1}
                      >
                        {job.company}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.rightContainer}>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: getStatusColor(job.status) },
                      ]}
                    >
                      <Text style={[styles.statusText, { fontSize: 13 }]}>
                        {getStatusLabel(job.status)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={[styles.detailsContainer, { marginTop: 12 }]}>
                  {job.salary && (
                    <View style={styles.detailRow}>
                      <MaterialIcons
                        name="attach-money"
                        size={18}
                        color="#2ecc71"
                      />
                      <Text style={[styles.detailText, { color: "#2c3e50" }]}>
                        {Number(job.salary).toLocaleString()} บาท
                      </Text>
                    </View>
                  )}

                  {job.location && (
                    <View style={styles.detailRow}>
                      <MaterialIcons
                        name="location-on"
                        size={18}
                        color="#e74c3c"
                      />
                      <Text style={[styles.detailText, { color: "#2c3e50" }]}>
                        {job.location}
                      </Text>
                    </View>
                  )}
                </View>
              </Card.Content>
            </Card>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  legendContainer: {
    marginTop: 16,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 8,
    elevation: 2,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  selectedDateContainer: {
    marginTop: 16,
    marginBottom: 8,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  jobList: {
    flex: 1,
  },
  cardContainer: {
    marginBottom: 12,
  },
  card: {
    borderRadius: 12,
    backgroundColor: "#fff",
    marginHorizontal: 2,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  cardContent: {
    padding: 16,
  },
  jobHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  jobInfo: {
    flex: 1,
  },
  positionText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2c3e50",
    marginBottom: 4,
  },
  companyContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  companyText: {
    fontSize: 16,
    color: "#7f8c8d",
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  detailText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#34495e",
  },
  jobTitleContainer: {
    flex: 1,
    marginRight: 12,
  },
  rightContainer: {
    alignItems: "flex-end",
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
    marginTop: 16,
  },
});
