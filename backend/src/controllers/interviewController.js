const Interview = require("../models/Interview");
const Availability = require("../models/Availability");
const Payment = require("../models/Payment");

const bookInterview = async (req, res) => {
  const { teacherId, date, startTime, duration, paymentId } = req.body;

  const payment = await Payment.findById(paymentId);
  if (!payment || payment.status !== "success") {
    return res.status(400).json({ message: "Payment not valid" });
  }

  const availability = await Availability.findOne({
    teacherId,
    date,
    "slots.startTime": startTime,
    "slots.isBooked": false,
  });

  if (!availability) {
    return res.status(400).json({ message: "Slot not available" });
  }

  availability.slots.forEach((slot) => {
    if (slot.startTime === startTime) slot.isBooked = true;
  });
  await availability.save();

  const interview = await Interview.create({
  studentId: req.user.id,
  teacherId,
  date,              // ✅ SAVE DATE
  startTime,         // ✅ SAVE TIME
  scheduledAt: new Date(`${date} ${startTime}`),
  duration,
  paymentId,
  status: "pending"
});

  payment.interviewId = interview._id;
  await payment.save();

  res.status(201).json({
    success: true,
    interview,
  });
};

const getMyInterviews = async (req, res) => {
  const interviews = await Interview.find({ studentId: req.user.id })
    .populate("teacherId", "name email");

  res.json({ success: true, interviews });
};

// GET /api/interviews/teacher
const getTeacherInterviews = async (req, res) => {
  const interviews = await Interview.find({
    teacherId: req.user.id,
  })
    .populate("studentId", "name email")
    .sort({ scheduledAt: 1 });

  res.json({
    success: true,
    interviews,
  });
};


const cancelInterview = async (req, res) => {
  const interview = await Interview.findById(req.params.id);
  if (!interview) {
    return res.status(404).json({ message: "Interview not found" });
  }

  if (interview.status === "cancelled") {
    return res.status(400).json({ message: "Already cancelled" });
  }

  // ✅ Use stored date & time
  const availability = await Availability.findOne({
    teacherId: interview.teacherId,
    date: interview.date
  });

  if (availability) {
    availability.slots.forEach(slot => {
      if (slot.startTime === interview.startTime) {
        slot.isBooked = false; // 🔓 unlock
      }
    });
    await availability.save();
  }

  interview.status = "cancelled";
  interview.cancelledBy = req.user.role;
  await interview.save();

  res.json({
    success: true,
    message: "Interview cancelled and slot unlocked"
  });
};

const updateInterviewStatus = async (req, res) => {
  const { status } = req.body;
  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    return res.status(404).json({ message: "Interview not found" });
  }

  // ❌ No updates after cancel or complete
  if (["cancelled", "completed"].includes(interview.status)) {
    return res.status(400).json({
      message: `Cannot update status after interview is ${interview.status}`,
    });
  }

  // ❌ Only teacher/admin can update
  if (
    req.user.role === "teacher" &&
    interview.teacherId.toString() !== req.user.id
  ) {
    return res.status(403).json({ message: "Not allowed" });
  }

  // ❌ Invalid transitions
  if (interview.status === "pending" && status !== "confirmed") {
    return res.status(400).json({
      message: "Pending interview can only be confirmed",
    });
  }

  if (interview.status === "confirmed" && status !== "completed") {
    return res.status(400).json({
      message: "Confirmed interview can only be completed",
    });
  }

  interview.status = status;
  await interview.save();

  res.json({
    success: true,
    interview,
  });
};
const addInterviewMeetingLink = async (req, res) => {
  try {
    const { meetingLink } = req.body;
    const interviewId = req.params.id;
    // console.log("Request to add meeting link for interview ID:", interviewId);
    // console.log("User making request:", meetingLink);

    // 🔹 Validation
    if (!meetingLink) {
      return res.status(400).json({
        success: false,
        message: "Meeting link is required",
      });
    }

    const interview = await Interview.findById(interviewId);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    // 🔹 Only teacher/admin allowed
    if (
      req.user.role === "teacher" &&
      interview.teacherId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this interview",
      });
    }

    // ❌ Block cancelled interviews
    if (interview.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot add meeting link to cancelled interview",
      });
    }

    // ❌ Block completed interviews
    if (interview.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot add meeting link after interview is completed",
      });
    }

    // ✅ Save / update link (allowed multiple times before completion)
    interview.meetingLink = meetingLink;
    await interview.save();

    return res.status(200).json({
      success: true,
      message: "Meeting link saved successfully",
      interview,
    });
  } catch (error) {
    console.error("Add meeting link error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


module.exports = {
  bookInterview,
  getMyInterviews,
  getTeacherInterviews,
  cancelInterview,
  updateInterviewStatus,
  addInterviewMeetingLink
};
