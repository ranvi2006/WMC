// =======================
// ENV & DB SETUP
// =======================
const dotenv = require("dotenv");
dotenv.config();

const connectDB = require("./init/db");
connectDB();

// =======================
// CORE IMPORTS
// =======================
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

// =======================
// UTILITIES & MIDDLEWARES
// =======================
const logError = require("./utils/errorLogger");
const { allowRoles } = require("./middlewares/roleMiddleware");
const { isAuthenticated } = require("./middlewares/authMiddleware");
const { verifyOtp,sendEmail } = require("./controllers/sendEmail");
const { resetPassword } = require("./controllers/authController");

// =======================
// CRON JOBS (RUN ON STARTUP)
// =======================
require("../src/cron/index");

// =======================
// CONTROLLERS
// =======================

// =======================
// ROUTES
// =======================

// Phase 1 & 2
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");

// Phase 3
const availabilityRoutes = require("./routes/availabilityRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const interviewRoutes = require("./routes/interviewRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const adminRoutes = require("./routes/adminRoutes");
const rescheduleRoutes = require("./routes/rescheduleRoutes");
const monitoringRoutes = require("./routes/monitoringRoutes");

// Phase 4
const errorRoutes = require("./routes/errorRoutes");

// =======================
// APP INIT
// =======================
const app = express();

// =======================
// SECURITY & GLOBAL MIDDLEWARE
// =======================
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

app.use(helmet());
app.use(morgan("dev"));

// =======================
// BASE ROUTE
// =======================
app.get("/", (req, res) => {
  res.send("Education App API is running 🚀");
});


// throw new Error("Model verification test");
// app.get ("/api/test-error",isAuthenticated,allowRoles("admin"), (req, res) => {
//   throw new Error("Model verification test");  
// });  


// =======================
// EMAIL (ADMIN ONLY)
// =======================
app.post("/send-email", sendEmail);
app.post("/verify-otp", verifyOtp);
app.post("/reset-password", resetPassword);

// =======================
// API ROUTES
// =======================

// Auth
app.use("/api/auth", authRoutes);

// Courses
app.use("/api/courses", courseRoutes);

// Enrollments
app.use("/api/enrollments", enrollmentRoutes);

// Roadmaps
app.use("/api/roadmaps", roadmapRoutes);

// Reschedule
app.use("/api/reschedule", rescheduleRoutes);

// =======================
// 🚀 PHASE 3 ROUTES
// =======================

// Teacher Availability
app.use("/api/availability", availabilityRoutes);

// Payments
app.use("/api/payments", paymentRoutes);

// Interviews
app.use("/api/interviews", interviewRoutes);

// Feedback
app.use("/api/feedback", feedbackRoutes);

// Admin
app.use("/api/admin", adminRoutes);

// Monitoring
app.use("/api/monitoring", monitoringRoutes);

// Admin Error Logs
app.use("/api/admin/errors", errorRoutes);

// =======================
// 404 HANDLER (MUST BE LAST)
// =======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// =======================
// GLOBAL ERROR HANDLER
// =======================
app.use((err, req, res, next) => {
  console.error("🔥 Global Error:", err.message);

  // Log error without blocking response
  logError(err, req).catch(console.error);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// =======================
// EXPORT APP
// =======================
module.exports = app;
