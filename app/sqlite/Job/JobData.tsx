import * as SQLite from "expo-sqlite";

export const addJob = async (
  db: SQLite.SQLiteDatabase,
  body: {
    company: string;
    position: string;
    jobdate: string;
    status: string;
    notes?: string;
    salary?: string;
    location?: string;
  }
) => {
  const {
    company = "",
    position = "",
    jobdate = "",
    status = "",
    notes = "",
    salary = "",
    location = "",
  } = body;

  // Convert jobdate to 'YYYY-MM-DD' format
  const formattedDate = new Date(jobdate).toISOString().split("T")[0];

  const result = await db.runAsync(
    "INSERT INTO jobs (company, position, jobdate, status, notes, salary, location) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [company, position, formattedDate, status, notes, salary, location]
  );
  console.log("Job added with ID:", result.lastInsertRowId);
};

export const updateJob = async (
  db: SQLite.SQLiteDatabase,
  jobId: string,
  body: {
    jobId: number;
    company: string;
    position: string;
    jobdate: string;
    status: string;
    notes?: string;
    salary?: string;
    location?: string;
  }
) => {
  const {
    company,
    position,
    jobdate,
    status,
    notes = "",
    salary = "",
    location = "",
  } = body;

  // Convert jobdate to 'YYYY-MM-DD' format
  const formattedDate = new Date(jobdate).toISOString().split("T")[0];

  await db.runAsync(
    "UPDATE jobs SET company = ?, position = ?, jobdate = ?, status = ?, notes = ?, salary = ?, location = ? WHERE id = ?",
    [company, position, formattedDate, status, notes, salary, location, jobId]
  );
  console.log("Job updated with ID:", jobId);
};

export const getAllJobs = async (
  db: SQLite.SQLiteDatabase
): Promise<Array<any>> => {
  try {
    const allRows = await db.getAllAsync("SELECT * FROM jobs");

    // ตรวจสอบว่าผลลัพธ์เป็น array ที่ว่างหรือไม่
    if (!allRows || allRows.length === 0) {
      console.log("No jobs found in the database.");
      return []; // คืนค่าเป็น array ว่าง
    }

    return allRows;
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return [];
  }
};

// ฟังก์ชันสำหรับดึงข้อมูลงานตาม ID
export const getJobById = async (db: SQLite.SQLiteDatabase, jobId: number) => {
  try {
    const result = await db.getFirstAsync("SELECT * FROM jobs WHERE id = ?", [
      jobId,
    ]);

    if (result) {
      console.log("fetchedJob", result);

      return result;
    } else {
      console.log(`No job found with ID ${jobId}.`);
      return null;
    }
  } catch (error) {
    console.error(`Failed to fetch job with ID ${jobId}:`, error);
    throw error;
  }
};

// ฟังก์ชันสำหรับลบงาน
export const deleteJob = async (db: SQLite.SQLiteDatabase, jobId: number) => {
  try {
    await db.runAsync("DELETE FROM jobs WHERE id = ?", [jobId]);
    console.log(`Job with ID ${jobId} deleted successfully.`);
  } catch (error) {
    console.error(`Failed to delete job with ID ${jobId}:`, error);
  }
};
