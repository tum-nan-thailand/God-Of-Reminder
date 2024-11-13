import React, { useContext, useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text } from "react-native-paper";
import { Calendar } from "react-native-calendars";
import { useTheme } from "../ThemeProvider";
import { DatabaseContext } from "../DatabaseContext";
import { getAllJobs } from "../sqlite/Job/JobData";
import { JobInterface } from "../sqlite/Job/Job.Interface";
import JobCard from "../../components/JobCard";

export default function CalendarScreen() {
  const { theme } = useTheme();
  const db: any = useContext(DatabaseContext);
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

  const onDayPress = (day: { dateString: any }) => {
    setSelectedDate(day.dateString);
    const newMarkedDates: Record<string, any> = { ...markedDates };
    Object.keys(newMarkedDates).forEach((date) => {
      const job = jobs.find((job) => job.jobdate.split("T")[0] === date);
      const selectedColor = job ? getStatusColor(job.status) : "#B0BEC5";
      newMarkedDates[date] = {
        ...newMarkedDates[date],
        selected: date === day.dateString,
        selectedColor: date === day.dateString ? selectedColor : "#B0BEC5",
      };
    });
    if (!newMarkedDates[day.dateString]) {
      newMarkedDates[day.dateString] = {
        selected: true,
        selectedColor: "#B0BEC5",
      };
    }
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
        style={{  marginTop : '10%' }}
        onDayPress={onDayPress}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: theme.colors.primary,
          todayTextColor: theme.colors.primary,
          arrowColor: theme.colors.primary,
          monthTextColor: theme.colors.primary,
          selectedDayTextColor: "#FFFFFF",
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
        {getJobsForSelectedDate().length > 0 ? (
          getJobsForSelectedDate().map((job) => (
            <JobCard
              key={job.id}
              job={job}
              getStatusColor={getStatusColor}
              getStatusLabel={getStatusLabel}
            />
          ))
        ) : (
          <View style={styles.noJobsContainer}>
            <Text style={[styles.noJobsText, { color: theme.colors.text }]}>
              ไม่มีงานในวันนี้
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  noJobsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  noJobsText: {
    fontSize: 16,
    fontWeight: "bold",
  },
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
});