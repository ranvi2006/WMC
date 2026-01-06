const { Resend } = require("resend");
const crypto = require("crypto");
const Otp = require("../models/Otp");

const resend = new Resend(process.env.RESEND_API_KEY);

const generateOTP = () =>
  crypto.randomInt(100000, 1000000).toString();

const sendEmail = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const otp = generateOTP();

    // 🔥 Save OTP in DB (expires in 10 min)
    await Otp.deleteMany({ email });
    await Otp.create({
      email,
      otp,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    });

    await resend.emails.send({
      from: "We Make Coder <onboarding@resend.dev>",
      to: [email],
      subject: "Your OTP Code – We Make Coder",
      html: `<h2>Your OTP is ${otp}</h2><p>Valid for 10 minutes</p>`,
    });

    res.json({ success: true, message: "OTP sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = await Otp.findOne({ email, otp });

  if (!record)
    return res.status(400).json({ message: "Invalid OTP" });

  if (record.expiresAt < new Date()) {
    await Otp.deleteOne({ _id: record._id });
    return res.status(400).json({ message: "OTP expired" });
  }

  // ✅ OTP valid
  await Otp.deleteOne({ _id: record._id });
  res.json({ success: true });
};

module.exports = { sendEmail, verifyOtp };