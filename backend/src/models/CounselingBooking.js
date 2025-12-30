const mongoose = require("mongoose");

const counselingSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  counselorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  topic: String,
  message: String,

  date: Date,
  timeSlot: String,
  meetingLink: String,

  status: {
    type: String,
    enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
    default: "PENDING"
  }
}, { timestamps: true });

module.exports = mongoose.model("CounselingBooking", counselingSchema);
