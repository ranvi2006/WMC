const Roadmap = require("../models/Roadmap");
const Course = require("../models/Course");
const { cloudinary } = require("../cloudnary/cloudnary"); // ✅ FIXED

// ✅ UPLOAD / REPLACE ROADMAP (Cloudinary)
exports.uploadRoadmap = async (req, res) => {
  try {
    console.log("User uploading roadmap:", req.file, req.user);

    const { courseId, title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "PDF file is required",
      });
    }

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ✅ Ownership check
    if (
      course.createdBy.toString() !== req.user.id &&
      !["admin", "teacher"].includes(req.user.role)
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // ✅ Deactivate old roadmaps (versioning)
    await Roadmap.updateMany(
      { courseId, isActive: true },
      { isActive: false }
    );

    const roadmapCount = await Roadmap.countDocuments({ courseId });

    const roadmap = await Roadmap.create({
      title,
      description,
      courseId,
      pdfUrl: req.file.path,        // Cloudinary URL
      publicId: req.file.filename,  // Needed for delete
      version: roadmapCount + 1,
      uploadedBy: req.user.id,
      isActive: true,
    });

    res.status(201).json({
      success: true,
      message: "Roadmap uploaded successfully",
      data: roadmap,
    });
  } catch (error) {
    console.error("UPLOAD ROADMAP ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ GET ACTIVE ROADMAP BY COURSE
exports.getRoadmapByCourse = async (req, res) => {
  const { courseId } = req.params;

  const roadmap = await Roadmap.findOne({
    courseId,
    isActive: true,
  });

  if (!roadmap) {
    return res.status(404).json({
      success: false,
      message: "Roadmap not found",
    });
  }

  res.json({
    success: true,
    data: roadmap,
  });
};

// ❌ DELETE ACTIVE ROADMAP BY COURSE
exports.deleteRoadmapByCourse = async (req, res) => {
  const { courseId } = req.params;

  const roadmap = await Roadmap.findOne({
    courseId,
    isActive: true,
  });

  if (!roadmap) {
    return res.status(404).json({
      success: false,
      message: "No active roadmap found",
    });
  }

  // ✅ SAFETY CHECK
  if (roadmap.publicId) {
    await cloudinary.uploader.destroy(roadmap.publicId, {
      resource_type: "raw",
    });
  } else {
    console.warn(
      "Roadmap has no publicId, skipping Cloudinary delete"
    );
  }

  // ❌ Delete from DB
  await roadmap.deleteOne();

  res.json({
    success: true,
    message: "Roadmap deleted successfully",
  });
};