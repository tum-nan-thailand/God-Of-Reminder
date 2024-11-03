import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Card, Text } from "react-native-paper";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { JobInterface } from "../app/sqlite/Job/Job.Interface";

interface JobCardProps {
  job: JobInterface;
  getStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
}

const JobCard: React.FC<JobCardProps> = ({ job, getStatusColor, getStatusLabel }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() => router.push(`/job-detail?jobId=${job.id}`)}
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
                  {Number(job?.salary ?? 0).toLocaleString()} บาท
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
  );
};

const styles = StyleSheet.create({
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
  jobTitleContainer: {
    flex: 1,
    marginRight: 12,
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
  rightContainer: {
    alignItems: "flex-end",
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
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
    marginTop: 16,
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
});

export default JobCard;