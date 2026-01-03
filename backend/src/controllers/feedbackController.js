const Feedback = require("../models/Feedback");
const Interview = require("../models/Interview");

exports.giveFeedback = async (req, res) => {
  const { interviewId, rating, strengths, improvements, recommendation } = req.body;

  // 1️⃣ Check interview exists
  const interview = await Interview.findById(interviewId);
  if (!interview) {
    return res.status(404).json({ message: "Interview not found" });
  }

  // 2️⃣ Only assigned teacher can give feedback
  if (interview.teacherId.toString() !== req.user.id) {
    return res.status(403).json({ message: "Not allowed" });
  }

  // 3️⃣ ❗ Interview must be COMPLETED
  if (interview.status !== "completed") {
    return res.status(400).json({
      message: "Feedback allowed only after interview is completed",
    });
  }

  // 4️⃣ Prevent duplicate feedback
  const existing = await Feedback.findOne({ interviewId });
  if (existing) {
    return res.status(400).json({ message: "Feedback already submitted" });
  }

  // 5️⃣ Create feedback
  const feedback = await Feedback.create({
    interviewId,
    teacherId: req.user.id,
    studentId: interview.studentId,
    rating,
    strengths,
    improvements,
    recommendation,
  });

  res.status(201).json({
    success: true,
    feedback,
  });
};
