const Interview = require("../models/Interview");
const RescheduleRequest = require("../models/RescheduleRequest");

/* =========================
   STUDENT → CREATE REQUEST
========================= */
exports.createRescheduleRequest = async (req, res) => {
  
  const { interviewId, requestedDate, requestedStartTime, reason } = req.body;

  const interview = await Interview.findById(interviewId);
  console.log("Reschedule request for interview:", interview);
  if (!interview) {
    return res.status(404).json({ message: "Interview not found" });
  }

  if (interview.status !== "cancelled") {
    return res.status(400).json({
      message: "Only cancelled interviews can be rescheduled",
    });
  }

  if (interview.rescheduleCount >= 1) {
    return res.status(400).json({
      message: "Reschedule already used for this interview",
    });
  }

  if (interview.cancelledBy !== "teacher" && interview.cancelledBy !== "student") {
    return res.status(403).json({
      message: "Reschedule not allowed",
    });
  }

  const existing = await RescheduleRequest.findOne({ interviewId });
  if (existing) {
    return res.status(400).json({
      message: "Reschedule request already exists",
    });
  }

  const request = await RescheduleRequest.create({
    interviewId,
    studentId: req.user.id,
    teacherId: interview.teacherId,
    requestedDate,
    requestedStartTime,
    reason,
  });

  res.status(201).json({ success: true, request });
};

/* =========================
   TEACHER → VIEW REQUESTS
========================= */
exports.getTeacherRequests = async (req, res) => {
  const requests = await RescheduleRequest.find({
    teacherId: req.user.id,
    status: "pending",
  }).populate("studentId interviewId");

  res.json({ success: true, requests });
};

/* =========================
   TEACHER → APPROVE
========================= */

exports.approveRequest = async (req, res) => {
  const { date, time } = req.body || {};

  const request = await RescheduleRequest.findById(req.params.id);
  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  const interview = await Interview.findById(request.interviewId);
  if (!interview) {
    return res.status(404).json({ message: "Interview not found" });
  }

  const finalDate = request.requestedDate || date;
  const finalTime = request.requestedStartTime || time;

  if (!finalDate || !finalTime) {
    return res.status(400).json({
      message: "Date and time are required to approve this request",
    });
  }

  interview.date = finalDate;
  interview.startTime = finalTime;
  interview.status = "pending";
  interview.cancelledBy = null;
  interview.rescheduleCount += 1;

  await interview.save();

  request.status = "approved";
  await request.save();

  res.json({ success: true });
};


exports.rejectRequest = async (req, res) => {
  const request = await RescheduleRequest.findById(req.params.id);
  if (!request) {
    return res.status(404).json({ message: "Request not found" });
  }

  request.status = "rejected";
  await request.save();

  res.json({ success: true });
};
