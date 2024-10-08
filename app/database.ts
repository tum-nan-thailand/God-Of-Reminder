// database.ts
import * as SQLite from "expo-sqlite";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import {} from 
// ฟังก์ชันสำหรับการเปิดฐานข้อมูลแบบ Async
export const initializeDatabase = async () => {
  const db = await SQLite.openDatabaseAsync("jobTracker.db");

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      applicationDate TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      salary TEXT,
      location TEXT
    );
  `);

  return db;
};

// การเพิ่มข้อมูล
// export const addJob = async (
//   db: SQLite.SQLiteDatabase,
//   company,
//   position,
//   applicationDate,
//   status,
//   notes = "",
//   salary = "",
//   location = ""
// ) => {
//   const result = await db.runAsync(
//     "INSERT INTO jobs (company, position, applicationDate, status, notes, salary, location) VALUES (?, ?, ?, ?, ?, ?, ?)",
//     [company, position, applicationDate, status, notes, salary, location]
//   );
//   console.log("Job added with ID:", result.lastInsertRowId);
// };

// ฟังก์ชันเริ่มต้นการทำงานของฐานข้อมูลและเพิ่มข้อมูลตัวอย่าง
export const initializeDB = async () => {
  const db = await initializeDatabase();

  // เพิ่มข้อมูลตัวอย่าง
  await addJob(
    db,
    "Company A",
    "Software Engineer",
    "2024-09-21",
    "Applied",
    "Interview on Monday",
    "$100,000",
    "New York"
  );
  await addJob(
    db,
    "Company B",
    "Designer",
    "2024-09-18",
    "Interview",
    "Interview completed, waiting for response",
    "$70,000",
    "Los Angeles"
  );
  await addJob(
    db,
    "Company C",
    "Manager",
    "2024-09-15",
    "Offered",
    "Offer accepted, start next month",
    "$120,000",
    "Chicago"
  );

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
export const closeDatabase = async (db) => {
  try {
    await db.closeAsync(); // ปิดฐานข้อมูลที่เปิดอยู่
    console.log('Database closed successfully.');
  } catch (error) {
    console.error('Failed to close database:', error);
  }
};


// ฟังก์ชันสำหรับลบฐานข้อมูลทั้งหมด
export const clearDatabase = async () => {
  try {
    const db = await SQLite.openDatabaseAsync('jobTracker.db'); // เปิดฐานข้อมูลเพื่อให้สามารถปิดได้
    await closeDatabase(db); // ปิดฐานข้อมูลก่อนที่จะลบ
    await SQLite.deleteDatabaseAsync('jobTracker.db'); // ลบฐานข้อมูล
    console.log('Database deleted successfully.');

    const newDb = await initializeDatabase(); // เปิดฐานข้อมูลใหม่อีกครั้งหลังจากลบ
    return newDb
  } catch (error) {
    console.error('Failed to delete database:', error);
  }
};

// ฟังก์ชันสำหรับรีเซ็ตฐานข้อมูลทั้งหมด
export const resetDatabase = async (db) => {
  try {
    await clearDatabase(); // ลบฐานข้อมูลทั้งหมด
    const db = await initializeDatabase(); // เริ่มต้นฐานข้อมูลใหม่
    console.log("Database reset and re-initialized successfully.");
    return db;
  } catch (error) {
    console.error("Failed to reset database:", error);
  }
};