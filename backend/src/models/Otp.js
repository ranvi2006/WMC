const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  purpose: {
    type: String,
    enum: ["register", "reset-password"]
  },
  expiresAt: { type: Date, required: true }
});

module.exports = mongoose.model("Otp", otpSchema);
