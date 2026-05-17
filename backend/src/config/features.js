const isProduction = process.env.APP_MODE === "production";

module.exports = {
  requireOtp: isProduction,
  sendEmails: isProduction,
  enablePayments: isProduction,
};
