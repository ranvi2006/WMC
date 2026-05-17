const Interview = require("../models/Interview");
const Availability = require("../models/Availability");
const Payment = require("../models/Payment");

const features = require("../config/features");

/* =========================================================
   BOOK INTERVIEW
========================================================= */

const bookInterview = async (req, res) => {
  try {
    const { teacherId, date, startTime, duration, paymentId } = req.body;
    console.log(req.body);
    /* =========================================================
       PAYMENT VALIDATION
    ========================================================= */

    // PRODUCTION:
    // require successful Razorpay payment

    if (features.enablePayments) {
      const payment = await Payment.findById(paymentId);

      if (!payment || payment.status !== "success") {
        return res.status(400).json({
          message: "Payment not valid",
        });
      }
    }

    /* =========================================================
       SLOT VALIDATION
    ========================================================= */

    const availability = await Availability.findOne({
      teacherId,
      date,
      "slots.startTime": startTime,
      "slots.isBooked": false,
    });

    if (!availability) {
      return res.status(400).json({
        message: "Slot not available",
      });
    }

    /* =========================================================
       LOCK SLOT
    ========================================================= */

    availability.slots.forEach((slot) => {
      if (slot.startTime === startTime) {
        slot.isBooked = true;
      }
    });

    await availability.save();

    /* =========================================================
       CREATE INTERVIEW
    ========================================================= */

    const interview = await Interview.create({
      studentId: req.user.id,

      teacherId,

      date,

      startTime,

      scheduledAt: new Date(`${date} ${startTime}`),

      duration,

      paymentId: features.enablePayments ? paymentId : null,

      status: "pending",
    });

    /* =========================================================
       LINK PAYMENT
    ========================================================= */

    // only in production
    if (features.enablePayments) {
      const payment = await Payment.findById(paymentId);

      if (payment) {
        payment.interviewId = interview._id;

        await payment.save();
      }
    }

    /* =========================================================
       RESPONSE
    ========================================================= */

    res.status(201).json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("BOOK INTERVIEW ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================
   GET MY INTERVIEWS
========================================================= */

const getMyInterviews = async (req, res) => {
  const interviews = await Interview.find({
    studentId: req.user.id,
  }).populate("teacherId", "name email");

  res.json({
    success: true,
    interviews,
  });
};

/* =========================================================
   GET TEACHER INTERVIEWS
========================================================= */

const getTeacherInterviews = async (req, res) => {
  const interviews = await Interview.find({
    teacherId: req.user.id,
  })
    .populate("studentId", "name email")
    .sort({
      scheduledAt: 1,
    });

  res.json({
    success: true,
    interviews,
  });
};

/* =========================================================
   CANCEL INTERVIEW
========================================================= */

const cancelInterview = async (req, res) => {
  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    return res.status(404).json({
      message: "Interview not found",
    });
  }

  if (interview.status === "cancelled") {
    return res.status(400).json({
      message: "Already cancelled",
    });
  }

  const availability = await Availability.findOne({
    teacherId: interview.teacherId,
    date: interview.date,
  });

  if (availability) {
    availability.slots.forEach((slot) => {
      if (slot.startTime === interview.startTime) {
        slot.isBooked = false;
      }
    });

    await availability.save();
  }

  interview.status = "cancelled";

  interview.cancelledBy = req.user.role;

  await interview.save();

  res.json({
    success: true,
    message: "Interview cancelled and slot unlocked",
  });
};

/* =========================================================
   UPDATE INTERVIEW STATUS
========================================================= */

const updateInterviewStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const interview = await Interview.findById(req.params.id);

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: "Interview not found",
      });
    }

    if (["cancelled", "completed"].includes(interview.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot update status after interview is ${interview.status}`,
      });
    }

    if (
      req.user.role === "teacher" &&
      interview.teacherId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not allowed",
      });
    }

    if (interview.status === "pending") {
      if (!["confirmed", "cancelled"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Pending interview can only be confirmed or cancelled",
        });
      }
    }

    if (interview.status === "confirmed") {
      if (!["completed", "cancelled"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Confirmed interview can only be completed or cancelled",
        });
      }
    }

    if (status === "cancelled") {
      interview.cancelledBy = req.user.role;
    }

    interview.status = status;

    await interview.save();

    return res.json({
      success: true,
      interview,
    });
  } catch (error) {
    console.error("Update interview status error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================
   ADD MEETING LINK
========================================================= */

const addInterviewMeetingLink = async (req, res) => {
  try {
    const { meetingLink } = req.body;

    const interviewId = req.params.id;

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

    if (
      req.user.role === "teacher" &&
      interview.teacherId.toString() !== req.user.id
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this interview",
      });
    }

    if (interview.status === "cancelled") {
      return res.status(400).json({
        success: false,
        message: "Cannot add meeting link to cancelled interview",
      });
    }

    if (interview.status === "completed") {
      return res.status(400).json({
        success: false,
        message: "Cannot add meeting link after interview is completed",
      });
    }

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

/* =========================================================
   ADMIN GET ALL INTERVIEWS
========================================================= */

const getAllInterviewsAdmin = async (req, res, next) => {
  try {
    const interviews = await Interview.find()
      .populate("studentId", "name email")
      .populate("teacherId", "name email")
      .sort({
        scheduledAt: -1,
      });

    res.status(200).json({
      success: true,
      count: interviews.length,
      interviews,
    });
  } catch (error) {
    console.error("Admin interview fetch failed:", error);

    next(error);
  }
};

/* =========================================================
   GET INTERVIEW BY ID
========================================================= */

const getInterviewById = async (req, res) => {
  const interview = await Interview.findById(req.params.id).populate(
    "teacherId",
    "name email",
  );

  if (!interview) {
    return res.status(404).json({
      message: "Interview not found",
    });
  }

  res.json({
    success: true,
    interview,
  });
};

/* =========================================================
   ADMIN CANCEL INTERVIEW
========================================================= */

const adminCancelInterview = async (req, res) => {
  const interview = await Interview.findById(req.params.id);

  if (!interview) {
    return res.status(404).json({
      message: "Interview not found",
    });
  }

  interview.status = "cancelled";

  interview.cancelledBy = "admin";

  await interview.save();

  res.json({
    success: true,
    interview,
  });
};

module.exports = {
  bookInterview,
  getMyInterviews,
  getTeacherInterviews,
  cancelInterview,
  updateInterviewStatus,
  addInterviewMeetingLink,
  getInterviewById,
  getAllInterviewsAdmin,
  adminCancelInterview,
};
