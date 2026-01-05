const ErrorLog = require("../models/ErrorLog");

exports.getErrorLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const { statusCode, search } = req.query;

    const query = {};

    // Filter by status code
    if (statusCode) {
      query.statusCode = statusCode;
    }

    // Search by message or route
    if (search) {
      query.$or = [
        { message: { $regex: search, $options: "i" } },
        { route: { $regex: search, $options: "i" } },
      ];
    }

    const total = await ErrorLog.countDocuments(query);

    const errors = await ErrorLog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      errors,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
