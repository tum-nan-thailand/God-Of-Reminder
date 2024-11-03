import * as SQLite from "expo-sqlite";

export const addJob = async (
  db: SQLite.SQLiteDatabase,
  body: {
    company: string;
    position: string;
    jobdate: string;
    status: string;
    notes?: string;
    salary?: number;
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

  const result = await db.runAsync(
    "INSERT INTO jobs (company, position, jobdate, status, notes, salary, location) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [company, position, jobdate, status, notes, salary, location]
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
    salary?: number;
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

    if (!allRows || allRows.length === 0) {
      console.log("No jobs found in the database.");
      return [];
    }

    return allRows;
  } catch (error) {
    console.error("Failed to fetch jobs:", error);
    return [];
  }
};

export const getJobById = async (db: SQLite.SQLiteDatabase, jobId: number) => {
  try {
    const result = await db.getFirstAsync("SELECT * FROM jobs WHERE id = ?", [
      jobId,
    ]);

    if (result) {
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

export const deleteJob = async (db: SQLite.SQLiteDatabase, jobId: number) => {
  try {
    await db.runAsync("DELETE FROM jobs WHERE id = ?", [jobId]);
    console.log(`Job with ID ${jobId} deleted successfully.`);
  } catch (error) {
    console.error(`Failed to delete job with ID ${jobId}:`, error);
  }
};
