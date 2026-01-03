const Interview = require("../models/Interview");
const Payment = require("../models/Payment");

const getAllInterviews = async (req, res) => {
  const interviews = await Interview.find()
    .populate("studentId teacherId");

  res.json({ success: true, interviews });
};

const getAllPayments = async (req, res) => {
  const payments = await Payment.find().populate("userId");
  res.json({ success: true, payments });
};

module.exports = {
  getAllInterviews,
  getAllPayments,
};
