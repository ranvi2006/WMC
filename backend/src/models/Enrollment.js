const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true
    },

    roadmapId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap"
    },

    enrolledAt: {
      type: Date,
      default: Date.now
    },

    progress: {
      type: Number,
      default: 0 // percentage
    },

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active"
    },

    completedAt: Date,

    certificateIssued: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

// Prevent duplicate enrollments
enrollmentSchema.index(
  { studentId: 1, courseId: 1 },
  { unique: true }
);

module.exports = mongoose.model("Enrollment", enrollmentSchema);
