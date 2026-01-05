const cron = require("node-cron");
const ErrorLog = require("../models/ErrorLog");
const sendAlertEmail = require("../utils/sendAlertEmail");

const ERROR_THRESHOLD = 5;
const WINDOW_MINUTES = 10;
const COOLDOWN_MINUTES = 30;

let lastAlertTime = null;

cron.schedule("*/5 * * * *", async () => {
  try {
    // console.log("🕛 Running daily slot creation...");
    const since = new Date(Date.now() - WINDOW_MINUTES * 60 * 1000);

    const errorCount = await ErrorLog.countDocuments({
      createdAt: { $gte: since },
    });

    if (
      lastAlertTime &&
      Date.now() - lastAlertTime < COOLDOWN_MINUTES * 60 * 1000
    ) {
      return;
    }
    // console.log(`${errorCount} >= ${ERROR_THRESHOLD}`);
    if (errorCount >= ERROR_THRESHOLD) {
       
console.log("email sent");
    //   await sendAlertEmail({
    //     subject: "🚨 Error Spike Alert",
    //     html: `
    //       <h2>System Alert</h2>
    //       <p><strong>${errorCount}</strong> errors detected in last ${WINDOW_MINUTES} minutes.</p>
    //       <p>Please check the admin error logs.</p>
    //     `,
    //   });

    //   lastAlertTime = Date.now();
    }
  } catch (err) {
    console.error("Error alert cron failed:", err.message);
  }
});
