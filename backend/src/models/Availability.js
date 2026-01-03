const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  date: {
    type: String, // "2026-01-10"
    required: true,
  },
  slots: [
    {
      startTime: String,
      endTime: String,
      isBooked: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

module.exports = mongoose.model("Availability", availabilitySchema);
