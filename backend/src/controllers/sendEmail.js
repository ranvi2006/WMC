const { Resend } = require("resend");
const crypto = require("crypto");

function generateOTP() {
  return crypto.randomInt(100000, 1000000); // 6-digit OTP
}

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (req, res) => {
  try {
    const { email } = req.body;
    const otp = generateOTP();

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

   const { data, error } = await resend.emails.send({
  from: "We Make Corder <onboarding@resend.dev>",
  to: [email],
  subject: "Your OTP Code – We Make Corder",
  html: `
    <div style="font-family: Arial, sans-serif; background:#f5f7fa; padding:24px;">
      <div style="max-width:480px; margin:auto; background:#ffffff; border-radius:8px; padding:24px;">
        
        <h2 style="color:#0b3c6d; text-align:center;">
          Verify Your Email
        </h2>

        <p style="color:#333; font-size:14px;">
          Hello,
        </p>

        <p style="color:#333; font-size:14px;">
          Use the OTP below to verify your email address. This code is valid for
          <strong>10 minutes</strong>.
        </p>

        <div style="
          margin:24px 0;
          text-align:center;
          font-size:28px;
          letter-spacing:6px;
          font-weight:bold;
          color:#1e88e5;
        ">
          ${otp}
        </div>

        <p style="color:#555; font-size:13px;">
          If you did not request this, please ignore this email.
        </p>

        <hr style="border:none; border-top:1px solid #eee; margin:20px 0;" />

        <p style="color:#999; font-size:12px; text-align:center;">
          © ${new Date().getFullYear()} We Make Corder. All rights reserved.
        </p>
      </div>
    </div>
  `,
});

    if (error) {
      return res.status(500).json({ error });
    }

    res.json({ success: true, data ,otp});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = { sendEmail }; // ✅ IMPORTANT