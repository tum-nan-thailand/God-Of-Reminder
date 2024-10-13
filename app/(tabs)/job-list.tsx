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
import { Card, Button } from "react-native-paper";
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

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
      headerBackTitle: "Custom Back",
      headerBackTitleStyle: { fontSize: 30 },
    });
  }, [navigation]);

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
              title={item.position}
              subtitle={`บริษัท: ${item.company}`}
              titleStyle={{
                color: theme.colors.primary,
                fontWeight: "bold",
                fontSize: 22,
              }}
              subtitleStyle={{
                color: theme.colors.textSecondary,
                fontSize: 16,
              }}
            />
            <Card.Content>
              <View style={styles.cardContentRow}>
                <Text style={[styles.text, { color: theme.colors.text }]}>
                  สถานะ:
                </Text>
                <Text
                  style={[styles.textValue, { color: theme.colors.primary }]}
                >
                  {item.status}
                </Text>
              </View>
              <View style={styles.cardContentRow}>
                <Text style={[styles.text, { color: theme.colors.text }]}>
                  วันที่สมัคร:
                </Text>
                <Text
                  style={[
                    styles.textValue,
                    { color: theme.colors.textSecondary },
                  ]}
                >
                  {item.jobdate}
                </Text>
              </View>
              {item.notes ? (
                <View style={styles.cardContentRow}>
                  <Text style={[styles.text, { color: theme.colors.text }]}>
                    หมายเหตุ:
                  </Text>
                  <Text
                    style={[
                      styles.textValue,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    {item.notes}
                  </Text>
                </View>
              ) : null}
            </Card.Content>
            <Card.Actions style={styles.cardActions}>
              <Button
                mode="contained"
                icon={() => (
                  <FontAwesome
                    name="pencil"
                    size={16}
                    color={theme.colors.onPrimary}
                  />
                )}
                labelStyle={{ color: theme.colors.onPrimary }}
                style={[
                  styles.button,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={() =>
                  navigation.navigate("edit-job", { jobId: item.id })
                }
              >
                แก้ไข
              </Button>
            </Card.Actions>
          </Card>
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
  },
  contentContainer: {
    paddingBottom: 10,
  },
  card: {
    marginVertical: 15,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
    position: "relative",
  },
  deleteIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  cardContentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 5,
  },
  text: {
    fontSize: 17,
    fontWeight: "600",
  },
  textValue: {
    fontSize: 17,
    fontWeight: "bold",
  },
  button: {
    marginHorizontal: 8,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  cardActions: {
    justifyContent: "flex-end",
    paddingRight: 10,
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
  },
});
