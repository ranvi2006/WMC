import { Resend } from "resend";

/**
 * Initialize Resend
 * Make sure RESEND_API_KEY is set in .env
 */
const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send Email Controller
 * Usage: app.post("/send-email", sendEmail)
 */
export const sendEmail = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    // Send email
    const { data, error } = await resend.emails.send({
      from: "We Make Corder <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to We Make Corder",
      html: `
        <h2>Welcome 👋</h2>
        <p>Your email service is working successfully.</p>
        <p>Happy learning 🚀</p>
      `,
    });

    if (error) {
      return res.status(500).json({
        success: false,
        error,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
      data,
    });
  } catch (err) {
    console.error("SendEmail Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
