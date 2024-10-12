// database.ts
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import { addJob, getAllJobs } from "./JobData";
// ฟังก์ชันสำหรับการเปิดฐานข้อมูลแบบ Async
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


// ฟังก์ชันเริ่มต้นการทำงานของฐานข้อมูลและเพิ่มข้อมูลตัวอย่าง
export const initializeDB = async () => {
  await clearDatabase(); // ลบฐานข้อมูลทั้งหมด
  const db = await initializeDatabase();

  // เพิ่มข้อมูลตัวอย่าง
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

// ฟังก์ชันสำหรับ export ไฟล์ฐานข้อมูล
export const exportDatabase = async () => {
  const dbPath = `${FileSystem.documentDirectory}SQLite/jobTracker.db`;
  const destinationPath = `${FileSystem.documentDirectory}jobTracker-exported.db`;

  try {
    // คัดลอกไฟล์ฐานข้อมูลไปยังตำแหน่งที่เข้าถึงได้
    await FileSystem.copyAsync({
      from: dbPath,
      to: destinationPath,
    });

    // แชร์ไฟล์ฐานข้อมูลที่ถูกคัดลอกแล้ว
    await Sharing.shareAsync(destinationPath, {
      mimeType: "application/octet-stream",
      dialogTitle: "Export Database",
    });

    console.log("Database exported successfully!");
  } catch (error) {
    console.error("Failed to export database:", error);
  }
};

// ฟังก์ชันสำหรับปิดฐานข้อมูล
export const closeDatabase = async (db: SQLite.SQLiteDatabase) => {
  try {
    await db.closeAsync(); // ปิดฐานข้อมูลที่เปิดอยู่
    console.log("Database closed successfully.");
  } catch (error) {
    console.error("Failed to close database:", error);
  }
};

// ฟังก์ชันสำหรับลบฐานข้อมูลทั้งหมด
export const clearDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync("jobTracker.db"); // เปิดฐานข้อมูลเพื่อให้สามารถปิดได้
    await closeDatabase(db); // ปิดฐานข้อมูลก่อนที่จะลบ
    await SQLite.deleteDatabaseAsync("jobTracker.db"); // ลบฐานข้อมูล
    console.log("Database deleted successfully.");

    const newDb = await initializeDatabase(); // เปิดฐานข้อมูลใหม่อีกครั้งหลังจากลบ
    return newDb;
  } catch (error) {
    console.error("Failed to delete database:", error);
  }
};

// ฟังก์ชันสำหรับรีเซ็ตฐานข้อมูลทั้งหมด
export const resetDatabase = async () => {
  try {
    await clearDatabase(); // ลบฐานข้อมูลทั้งหมด
    const db = await initializeDatabase(); // เริ่มต้นฐานข้อมูลใหม่
    console.log("Database reset and re-initialized successfully.");
    return db;
  } catch (error) {
    console.error("Failed to reset database:", error);
  }
};
