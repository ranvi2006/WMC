const Feedback = require("../models/Feedback");
const Interview = require("../models/Interview");

exports.giveFeedback = async (req, res) => {
  try {
    const {
      interviewId,
      rating,
      strengths,
      improvements,
      recommendation,
    } = req.body;

    // 0️⃣ Basic validation
    if (!interviewId || !rating || !strengths || !improvements) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5",
      });
    }

    // 1️⃣ Check interview exists
    const interview = await Interview.findById(interviewId);
    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    // 2️⃣ Only assigned teacher
    if (interview.teacherId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    // 3️⃣ Interview must be completed
    if (interview.status !== "completed") {
      return res.status(400).json({
        success: false,
        message:
          "Feedback allowed only after interview is completed",
      });
    }

    // 4️⃣ Prevent duplicate feedback
    const existing = await Feedback.findOne({ interviewId });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Feedback already submitted",
      });
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

    return res.status(201).json({
      success: true,
      feedback,
    });
  } catch (error) {
    console.error("Give feedback error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.getFeedbackByInterview = async (req, res) => {
  const feedback = await Feedback.findOne({
    interviewId: req.params.interviewId,
  })
    .populate("teacherId", "name email")
    .populate("studentId", "name email");

  if (!feedback) {
    return res.status(404).json({
      success: false,
      message: "Feedback not found",
    });
  }

  res.json({
    success: true,
    feedback,
  });
};

