const mongoose = require("mongoose");

exports.getSystemHealth = async (req, res) => {
  try {
    const uptimeSeconds = process.uptime();
    const uptime = `${Math.floor(uptimeSeconds / 3600)}h ${Math.floor(
      (uptimeSeconds % 3600) / 60
    )}m`;

    // DB status
    const dbState = mongoose.connection.readyState;
    const dbStatus =
      dbState === 1 ? "Connected" : "Disconnected";

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

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
        last24h: 2, // mock
        topError: "JWT expired",
        lastErrorTime: "1h ago",
      },

      systemLoad: {
        requestsLastHour: 124, // mock
        avgResponseTime: "180ms", // mock
      },

      queues: {
        emailQueue: "Idle",
        failedJobs: 0,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
