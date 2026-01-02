const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const { sendEmail } = require("./controllers/sendEmail");
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollmentRoutes");
const roadmapRoutes = require("./routes/roadmapRoutes");

const app = express();
const path = require("path");

// =======================
// Middleware
// =======================
app.use(express.json());
app.use(cors());


// =======================
// Routes
// =======================
app.get("/", (req, res) => {
  res.send("Education App API is running 🚀");
});

// Email Route
app.post("/api/send-email", sendEmail);

// Auth Routes
app.use("/api/auth", authRoutes);

// Course Routes
app.use("/api/courses", courseRoutes);


// Enrollment Routes
app.use("/api/enrollments", enrollmentRoutes);

app.use("/api/roadmaps",roadmapRoutes);

  

// =======================
// 404 Handler (MUST BE LAST before error handler)
// =======================
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// =======================
// GLOBAL ERROR HANDLER (MUST BE VERY LAST)
// =======================
app.use((err, req, res, next) => {
  console.error("Global error handler:", err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error"
  });
});

module.exports = app;
