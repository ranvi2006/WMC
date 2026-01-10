const Interview = require("../models/Interview");
const Payment = require("../models/Payment");
const User = require("../models/User"); // 👈 ADD THIS
const { isFounderEmail } = require("../utils/isFounder");

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

const getAllUsers = async (req, res) => {
  try {
    // const isFounder = isFounderEmail(req.user.email);
    const founderEmail=req?.user?.email;
    const users = await User.find()
      .select("-password") // 🔒 never send password
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users:users,
      isFounder:isFounderEmail(founderEmail)
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    // 🔒 Only Founder / Co-Founder
    if (!isFounderEmail(req.user.email)) {
      return res.status(403).json({
        message: "Only Founder or Co-Founder can update roles"
      });
    }

    await User.findByIdAndUpdate(userId, { role });

    res.status(200).json({
      success: true,
      message: "Role updated successfully"
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getAllInterviews,
  getAllPayments,
  getAllTeachers, // 👈 EXPORT IT
  getAllUsers,
  updateUserRole,
};
