import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { addJob, getAllJobs } from "./JobData";

export const initializeDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("jobTracker.db");

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      jobdate TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      salary INTEGER,
      location TEXT
    );
  `);

  return db;
};


export const initializeDB = async () => {
  await clearDatabase(); 
  const db = await initializeDatabase();

  await addJob(db, {
    company: "Company A",
    position: "Software Engineer",
    jobdate: "2024-09-21",
    status: "Applied",
    notes: "Interview on Monday",
    salary: "$100,000",
    location: "New York",
  });
  await addJob(db, {
    company: "Company B",
    position: "Designer",
    jobdate: "2024-09-18",
    status: "Interview",
    notes: "Interview completed, waiting for response",
    salary: "$70,000",
    location: "Los Angeles",
  });
  await addJob(db, {
    company: "Company C",
    position: "Manager",
    jobdate: "2024-09-15",
    status: "Offered",
    notes: "Offer accepted, start next month",
    salary: "$120,000",
    location: "Chicago",
  });

  const jobs = await getAllJobs(db);
  return db;
};

export const exportDatabase = async () => {
  const dbPath = `${FileSystem.documentDirectory}SQLite/jobTracker.db`;
  const destinationPath = `${FileSystem.documentDirectory}jobTracker-exported.db`;

  try {
    await FileSystem.copyAsync({
      from: dbPath,
      to: destinationPath,
    });

    await Sharing.shareAsync(destinationPath, {
      mimeType: "application/octet-stream",
      dialogTitle: "Export Database",
    });

    console.log("Database exported successfully!");
  } catch (error) {
    console.error("Failed to export database:", error);
  }
};

export const closeDatabase = async (db: SQLite.SQLiteDatabase) => {
  try {
    await db.closeAsync(); 
    console.log("Database closed successfully.");
  } catch (error) {
    console.error("Failed to close database:", error);
  }
};

export const clearDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("jobTracker.db"); 
    await closeDatabase(db); 
    await SQLite.deleteDatabaseAsync("jobTracker.db"); 
    console.log("Database deleted successfully.");

    const newDb = await initializeDatabase(); 
    return newDb;
  } catch (error) {
    console.error("Failed to delete database:", error);
  }
};

export const resetDatabase = async () => {
  try {
    await clearDatabase(); 
    const db = await initializeDatabase(); 
    console.log("Database reset and re-initialized successfully.");
    return db;
  } catch (error) {
    console.error("Failed to reset database:", error);
  }
};
