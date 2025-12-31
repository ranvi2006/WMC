const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      index: true
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true
    },

    description: {
      type: String,
      required: true
    },

    thumbnail: {
      type: String // cloudinary / s3 URL
    },

    level: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner"
    },

    category: {
      type: String,
      index: true
    },

    language: {
      type: String,
      default: "English"
    },

    price: {
      type: Number,
      default: 0 // future paid courses
    },

    roadmap: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roadmap"
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft"
    },

    totalEnrollments: {
      type: Number,
      default: 0
    },

    averageRating: {
      type: Number,
      default: 0
    },

    isFeatured: {
      type: Boolean,
      default: false
    },

    tags: [String],

    publishedAt: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
