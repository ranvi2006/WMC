const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require("cors");
const { sendEmail } = require("./controllers/sendEmail");
const authRoutes = require("./routes/authRoutes");

const app = express();

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

// =======================
// 404 Handler (MUST BE LAST)
// =======================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

module.exports = app;
