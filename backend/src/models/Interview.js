const mongoose = require("mongoose");

const interviewSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Slot info
    date: {
      type: String,
      required: true,
    },

    startTime: {
      type: String,
      required: true,
    },

    scheduledAt: {
      type: Date,
      required: true,
    },

    duration: {
      type: Number,
      enum: [30, 45, 60],
      default: 30,
    },

    // Interview lifecycle
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },

    // ✅ MEETING LINK (Zoom / Google Meet)
    meetingLink: {
      type: String,
      default: null,
    },

    paymentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Payment",
    },

    cancelledBy: {
      type: String,
      enum: ["student", "teacher", "admin"],
      default: null,
    },
  },
  { timestamps: true }
);

// ✅ SAFE EXPORT
module.exports =
  mongoose.models.Interview ||
  mongoose.model("Interview", interviewSchema);
