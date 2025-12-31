const Roadmap = require("../models/Roadmap");
const Course = require("../models/Course");

// ✅ UPLOAD / REPLACE ROADMAP
exports.uploadRoadmap = async (req, res) => {
  try {
    const { courseId, title, description } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    // Ownership check
    if (
      course.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Deactivate old roadmap
    await Roadmap.updateMany(
      { courseId, isActive: true },
      { isActive: false }
    );

    const roadmapCount = await Roadmap.countDocuments({ courseId });

    const roadmap = await Roadmap.create({
      title,
      description,
      courseId,
      pdfUrl: req.file.path,
      version: roadmapCount + 1,
      uploadedBy: req.user.id
    });

    // Attach to course
    course.roadmap = roadmap._id;
    await course.save();

    res.status(201).json({
      success: true,
      message: "Roadmap uploaded successfully",
      data: roadmap
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
