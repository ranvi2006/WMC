const mongoose = require("mongoose");
const ErrorLog = require("../models/ErrorLog");

exports.getSystemHealth = async (req, res) => {
  try {
    /* =====================
       SERVER HEALTH
    ===================== */
    const uptimeSeconds = process.uptime();
    const uptime = `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor(
      (uptimeSeconds % 3600) / 60
    )}m`;

    /* =====================
       DATABASE HEALTH
    ===================== */
    const dbState = mongoose.connection.readyState;
    const dbStatus = dbState === 1 ? "Connected" : "Disconnected";

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    /* =====================
       ERROR MONITORING (REAL)
    ===================== */
    const last24hTime = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const totalErrors = await ErrorLog.countDocuments({
      createdAt: { $gte: last24hTime },
    });

    const topErrorAgg = await ErrorLog.aggregate([
      { $match: { createdAt: { $gte: last24hTime } } },
      { $group: { _id: "$message", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    const lastError = await ErrorLog.findOne().sort({ createdAt: -1 });

    const lastErrorTime = lastError
      ? `${Math.floor(
          (Date.now() - lastError.createdAt.getTime()) / (1000 * 60)
        )}m ago`
      : "N/A";

    /* =====================
       RESPONSE
    ===================== */
    res.json({
      success: true,

      server: {
        status: "Online",
        uptime,
        environment: process.env.NODE_ENV || "development",
      },

      database: {
        status: dbStatus,
        responseTime: "120ms", // mock for now
        collections: collections.length,
      },

      errors: {
        last24h: totalErrors,
        topError: topErrorAgg[0]?._id || "None",
        lastErrorTime,
      },

      systemLoad: {
        requestsLastHour: 124, // mock
        avgResponseTime: "180ms", // mock
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
