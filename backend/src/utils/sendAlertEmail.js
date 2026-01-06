const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendAlertEmail = async ({ subject, html }) => {
  try {
    await resend.emails.send({
      from: "System Monitor <onboarding@resend.dev>",
      to: [process.env.ADMIN_EMAIL],
      subject,
      html,
    });
  } catch (err) {
    console.error("Resend email failed:", err.message);
  }
};

module.exports = sendAlertEmail;
