const ErrorLog = require("../models/ErrorLog");

const errorLogger = async (err, req, statusCode = 500) => {
  try {
    await ErrorLog.create({
      message: err.message,
      stack: err.stack,
      route: req.originalUrl,
      method: req.method,
      statusCode,
      environment: process.env.NODE_ENV || "development",
    });
  } catch (e) {
    console.error("Failed to log error", e);
  }
};

module.exports = errorLogger;
