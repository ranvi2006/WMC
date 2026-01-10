const { Resend } = require("resend");
const crypto = require("crypto");
const Otp = require("../models/Otp");

const resend = new Resend(process.env.RESEND_API_KEY);

const generateOTP = () =>
  crypto.randomInt(100000, 1000000).toString();

const sendEmail = async (req, res) => {
  try {
    console.log("Entered");
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
     console.log(email);
    const result = await resend.emails.send({
  from: "We Make Coder <no-reply@wemakecoder.com>",
  to: email,
  subject: "Your OTP Code – We Make Coder",
  html: `
  <div style="background:#f4f6fb;padding:40px 0;font-family:Arial,sans-serif;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 30px rgba(0,0,0,0.08);">

      <div style="background:linear-gradient(135deg,#6d28d9,#4f46e5);padding:24px;text-align:center;">
        <h1 style="color:#ffffff;margin:0;font-size:22px;">We Make Coder</h1>
        <p style="color:#e0e7ff;margin-top:6px;font-size:14px;">
          Secure Account Verification
        </p>
      </div>

      <div style="padding:32px;color:#111827;">
        <h2 style="margin-top:0;font-size:20px;">Your One-Time Password</h2>

        <p style="font-size:15px;color:#4b5563;">
          Use the OTP below to complete your verification.  
          This code is valid for <strong>10 minutes</strong>.
        </p>

        <div style="margin:28px 0;text-align:center;">
          <span style="
            display:inline-block;
            font-size:32px;
            letter-spacing:8px;
            padding:14px 26px;
            background:#f3f4f6;
            border-radius:10px;
            font-weight:700;
            color:#111827;
          ">
            ${otp}
          </span>
        </div>

        <p style="font-size:14px;color:#6b7280;">
          If you didn’t request this, you can safely ignore this email.
        </p>

        <p style="margin-top:28px;font-size:13px;color:#9ca3af;">
          — Team We Make Coder
        </p>
      </div>

      <div style="background:#f9fafb;padding:16px;text-align:center;font-size:12px;color:#9ca3af;">
        © ${new Date().getFullYear()} We Make Coder. All rights reserved.
      </div>

    </div>
  </div>
  `,
});

  //  console.log(res);
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
