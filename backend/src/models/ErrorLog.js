const mongoose = require("mongoose");

const errorLogSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: true,
    },

    stack: {
      type: String,
      required: true,
    },

    route: {
      type: String,
      required: true,
    },

    method: {
      type: String,
      required: true,
    },

    statusCode: {
      type: Number,
      required: true,
    },

    environment: {
      type: String,
      default: "development",
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = mongoose.model("ErrorLog", errorLogSchema);
