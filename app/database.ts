// database.ts
import * as SQLite from 'expo-sqlite';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

// ฟังก์ชันสำหรับการเปิดฐานข้อมูลแบบ Async
export const initializeDatabase = async () => {
  const db = await SQLite.openDatabaseAsync('jobTracker.db');

  await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      position TEXT NOT NULL,
      applicationDate TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT
    );
  `);

  return db;
};

// การเพิ่มข้อมูล
export const addJob = async (db : SQLite.SQLiteDatabase, company, position, applicationDate, status, notes = '') => {
  const result = await db.runAsync(
    "INSERT INTO jobs (company, position, applicationDate, status, notes) VALUES (?, ?, ?, ?, ?)",
    [company, position, applicationDate, status, notes]
  );
  console.log("Job added with ID:", result.lastInsertRowId);
};

// การดึงข้อมูลทั้งหมด
export const getAllJobs = async (db: SQLite.SQLiteDatabase) => {
  const allRows = await db.getAllAsync("SELECT * FROM jobs");
  return allRows;
};

// ฟังก์ชันเริ่มต้นการทำงานของฐานข้อมูลและเพิ่มข้อมูลตัวอย่าง
export const initializeDB = async () => {
  const db = await initializeDatabase();

  // เพิ่มข้อมูลตัวอย่าง
  await addJob(db, "Company A", "Software Engineer", "2024-09-21", "Applied", "Interview on Monday");
  await addJob(db, "Company B", "Designer", "2024-09-18", "Interview", "Interview completed, waiting for response");
  await addJob(db, "Company C", "Manager", "2024-09-15", "Offered", "Offer accepted, start next month");

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
      mimeType: 'application/octet-stream',
      dialogTitle: 'Export Database',
    });

    console.log('Database exported successfully!');
  } catch (error) {
    console.error('Failed to export database:', error);
  }
};
