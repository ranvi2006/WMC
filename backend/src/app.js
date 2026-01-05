const dotenv = require("dotenv");
dotenv.config();
const connectDB = require('./init/db');
// Connect to Database
connectDB();
const express = require("express");
const cors = require("cors");
const path = require("path");

const { sendEmail } = require("./controllers/sendEmail");

// Phase 1 & 2 Routes
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");

// ✅ Phase 3 Routes
const availabilityRoutes = require("./routes/availabilityRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const adminRoutes = require("./routes/adminRoutes");
const rescheduleRoutes = require("./routes/rescheduleRoutes");

const app = express();

// =======================
// Middleware
// =======================
app.use(express.json());
app.use(cors());

// =======================
// Base Route
// =======================
app.get("/", (req, res) => {
  res.send("Education App API is running 🚀");
});

// =======================
// Routes
// =======================

// Email Route
app.post("/api/send-email", sendEmail);

// Auth Routes
app.use("/api/auth", authRoutes);

// Course Routes
app.use("/api/courses", courseRoutes);

// Enrollment Routes
app.use("/api/enrollments", enrollmentRoutes);

// Roadmap Routes
app.use("/api/roadmaps", roadmapRoutes);

app.use("/api/reschedule", rescheduleRoutes);


// =======================
// 🚀 PHASE 3 ROUTES
// =======================

// Teacher Availability
app.use("/api/availability", availabilityRoutes);

// Payments
app.use("/api/payments", paymentRoutes);

// Interviews (student + teacher + admin)
app.use("/api/interviews", interviewRoutes);

// Feedback
app.use("/api/feedback", feedbackRoutes);

// Admin (interviews, payments, analytics later)
app.use("/api/admin", adminRoutes);


// auto create folder for uploads if not exists
// start cron jobs
// require("./cron");


// =======================
// 404 Handler (MUST BE LAST before error handler)
// =======================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// =======================
// GLOBAL ERROR HANDLER (MUST BE VERY LAST)
// =======================
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
