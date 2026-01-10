const cron = require("node-cron");
const { Resend } = require("resend");
const ErrorLog = require("../models/ErrorLog");

const resend = new Resend(process.env.RESEND_API_KEY);

const ERROR_THRESHOLD = 5;
const WINDOW_MINUTES = 10;
const COOLDOWN_MINUTES = 30;

// In-memory cooldown (OK for now)
let lastAlertTime = null;

cron.schedule("*/5 * * * *", async () => {
  try {
    const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);

    const errorCount = await ErrorLog.countDocuments({
      createdAt: { $gte: since },
    });

    // If below threshold, do nothing
    if (errorCount < ERROR_THRESHOLD) return;

    // Cooldown check
    if (
      lastAlertTime &&
      Date.now() - lastAlertTime < COOLDOWN_MINUTES * 60 * 1000
    ) {
      return;
    }

    // 🔥 SEND ALERT EMAIL
    await resend.emails.send({
      from: "We Make Coder <no-reply@send.wemakecoder.com>",
      to: ["admin@wemakecoder.com"], // change if needed
      subject: "🚨 Error Spike Alert",
      html: `
        <div style="font-family: Arial, sans-serif">
          <h2>🚨 System Alert</h2>
          <p><strong>${errorCount}</strong> errors detected in the last ${WINDOW_MINUTES} minutes.</p>
          <p>Please check the admin error logs.</p>
        </div>
      `,
    });

    lastAlertTime = Date.now();

    console.log("🚨 Error alert email sent");
  } catch (err) {
    console.error("Error alert cron failed:", err);
  }
});
