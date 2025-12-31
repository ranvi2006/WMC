const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Roadmap = require("../models/Roadmap");

// ✅ ENROLL IN COURSE
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;

    const course = await Course.findOne({
      _id: courseId,
      status: "published"
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not available"
      });
    }

    // Prevent duplicate enrollment
    const existing = await Enrollment.findOne({
      studentId: req.user.id,
      courseId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled in this course"
      });
    }

    // Get active roadmap
    const roadmap = await Roadmap.findOne({
      courseId,
      isActive: true
    });

    const enrollment = await Enrollment.create({
      studentId: req.user.id,
      courseId,
      roadmapId: roadmap ? roadmap._id : null
    });

    // Update analytics
    course.totalEnrollments += 1;
    await course.save();

    res.status(201).json({
      success: true,
      message: "Enrolled successfully",
      data: enrollment
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ MY ENROLLMENTS (STUDENT)
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      studentId: req.user.id
    })
      .populate("courseId")
      .populate("roadmapId")
      .sort({ enrolledAt: -1 });

    res.json({ success: true, data: enrollments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ COURSE ENROLLMENTS (ADMIN)
exports.getCourseEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      courseId: req.params.id
    })
      .populate("studentId", "name email")
      .sort({ enrolledAt: -1 });

    res.json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
