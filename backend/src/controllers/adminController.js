const Interview = require("../models/Interview");
const Payment = require("../models/Payment");
const User = require("../models/User"); // 👈 ADD THIS

const getAllInterviews = async (req, res) => {
  const interviews = await Interview.find()
    .populate("studentId teacherId");

  res.json({ success: true, interviews });
};

const getAllPayments = async (req, res) => {
  const payments = await Payment.find().populate("userId");
  res.json({ success: true, payments });
};

// ✅ ADD THIS FUNCTION
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find(
      { role: "teacher" },
      "name email" // only needed fields
    );

    res.json({
      success: true,
      teachers,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  getAllInterviews,
  getAllPayments,
  getAllTeachers, // 👈 EXPORT IT
};
