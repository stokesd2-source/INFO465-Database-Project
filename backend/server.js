const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

app.get("/", (req, res) => {
  res.send("Backend is running");
});

app.get("/students", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM students");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

app.get("/instructors", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM instructors");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching instructors:", error);
    res.status(500).json({ error: "Failed to fetch instructors" });
  }
});

app.get("/courses", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM courses");
    res.json(rows);
  } catch (error) {
    console.error("Error fetching courses:", error);
    res.status(500).json({ error: "Failed to fetch courses" });
  }
});

app.get("/sessions", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        s.session_id,
        s.day,
        s.time,
        s.room,
        s.modality,
        c.course_id,
        c.title AS course_title,
        c.credits,
        c.max_capacity,
        i.instructor_id,
        i.name AS instructor_name
      FROM sessions s
      JOIN courses c ON s.course_id = c.course_id
      JOIN instructors i ON s.instructor_id = i.instructor_id
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching sessions:", error);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const [rows] = await db.query(
      "SELECT * FROM students WHERE username = ? AND password = ?",
      [username, password]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    res.json({
      message: "Login successful",
      student: rows[0]
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Login failed" });
  }
});

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT NOW() AS currentTime");
    res.json({
      message: "Database connection works",
      result: rows[0]
    });
  } catch (error) {
    console.error("Database test failed:", error);
    res.status(500).json({ error: "Database connection failed" });
  }
});

app.get("/students/:studentId/completed-courses", async (req, res) => {
  try {
    const { studentId } = req.params;

    const [rows] = await db.query(
      `SELECT course_id
       FROM completed_courses
       WHERE student_id = ?`,
      [studentId]
    );

    res.json(rows);
  } catch (error) {
    console.error("Error fetching completed courses:", error);
    res.status(500).json({ error: "Failed to fetch completed courses" });
  }
});

app.get("/students/:studentId/enrollments", async (req, res) => {
  try {
    const { studentId } = req.params;

    const [rows] = await db.query(`
      SELECT
        e.enrollment_id,
        s.session_id,
        s.day,
        s.time,
        s.room,
        s.modality,
        c.course_id,
        c.title,
        c.credits,
        i.name AS instructor_name
      FROM enrollments e
      JOIN sessions s ON e.session_id = s.session_id
      JOIN courses c ON s.course_id = c.course_id
      JOIN instructors i ON s.instructor_id = i.instructor_id
      WHERE e.student_id = ?
    `, [studentId]);

    res.json(rows);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const { studentId, sessionId } = req.body;

    if (!studentId || !sessionId) {
      return res.status(400).json({ error: "studentId and sessionId are required" });
    }

    // 1. Get session + course info
    const [sessionRows] = await db.query(`
      SELECT
        s.session_id,
        s.course_id,
        c.title,
        c.max_capacity,
        c.prereq_id
      FROM sessions s
      JOIN courses c ON s.course_id = c.course_id
      WHERE s.session_id = ?
    `, [sessionId]);

    if (sessionRows.length === 0) {
      return res.status(404).json({ error: "Session not found" });
    }

    const session = sessionRows[0];

    // 2. Check if already enrolled
    const [existingEnrollment] = await db.query(
      `SELECT * FROM enrollments WHERE student_id = ? AND session_id = ?`,
      [studentId, sessionId]
    );

    if (existingEnrollment.length > 0) {
      return res.status(400).json({ error: "You are already enrolled in this session." });
    }

    // 3. Check capacity
    const [countRows] = await db.query(
      `SELECT COUNT(*) AS enrolledCount FROM enrollments WHERE session_id = ?`,
      [sessionId]
    );

    const enrolledCount = countRows[0].enrolledCount;

    if (enrolledCount >= session.max_capacity) {
      return res.status(400).json({
        error: `This session is full (${session.max_capacity}/${session.max_capacity} seats taken).`
      });
    }

    // 4. Check prerequisite
    if (session.prereq_id) {
      const [prereqRows] = await db.query(
        `SELECT * FROM completed_courses WHERE student_id = ? AND course_id = ?`,
        [studentId, session.prereq_id]
      );

      if (prereqRows.length === 0) {
        return res.status(400).json({
          error: `Missing prerequisite: ${session.prereq_id} must be completed before enrolling.`
        });
      }
    }

    // 5. Insert enrollment
    await db.query(
      `INSERT INTO enrollments (student_id, session_id) VALUES (?, ?)`,
      [studentId, sessionId]
    );

    res.json({
      message: `Enrolled successfully in ${session.course_id} - ${session.title}`
    });

  } catch (error) {
    console.error("Error registering student:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/drop", async (req, res) => {
  try {
    const { studentId, sessionId } = req.body;

    if (!studentId || !sessionId) {
      return res.status(400).json({ error: "studentId and sessionId are required" });
    }

    const [existing] = await db.query(
      `SELECT * FROM enrollments WHERE student_id = ? AND session_id = ?`,
      [studentId, sessionId]
    );

    if (existing.length === 0) {
      return res.status(400).json({ error: "You are not enrolled in this session." });
    }

    await db.query(
      `DELETE FROM enrollments WHERE student_id = ? AND session_id = ?`,
      [studentId, sessionId]
    );

    res.json({ message: "Course dropped successfully." });
  } catch (error) {
    console.error("Error dropping enrollment:", error);
    res.status(500).json({ error: "Drop failed" });
  }
});

app.get("/enrollments/by-session", async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT session_id, student_id
      FROM enrollments
    `);

    const grouped = {};

    for (const row of rows) {
      if (!grouped[row.session_id]) grouped[row.session_id] = [];
      grouped[row.session_id].push(row.student_id);
    }

    res.json(grouped);
  } catch (error) {
    console.error("Error fetching enrollments by session:", error);
    res.status(500).json({ error: "Failed to fetch enrollments" });
  }
});

app.listen(process.env.PORT || 3001, () => {
  console.log(`Server running on port ${process.env.PORT || 3001}`);
});