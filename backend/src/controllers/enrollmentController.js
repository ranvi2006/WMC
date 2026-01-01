const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const Roadmap = require("../models/Roadmap");

/* =====================================
   ✅ ENROLL IN COURSE (STUDENT)
===================================== */
exports.enrollCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const studentId = req.user.id;

    // 1️⃣ Check course
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

    // 2️⃣ Prevent duplicate enrollment
    const existing = await Enrollment.findOne({
      studentId,
      courseId
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Already enrolled in this course"
      });
    }

    // 3️⃣ Get active roadmap
    const roadmap = await Roadmap.findOne({
      courseId,
      isActive: true
    });

    // 4️⃣ Create enrollment
    const enrollment = await Enrollment.create({
      studentId,
      courseId,
      roadmapId: roadmap ? roadmap._id : null,
      status: "active"
    });

    // 5️⃣ Atomic analytics update
    await Course.updateOne(
      { _id: courseId },
      { $inc: { totalEnrollments: 1 } }
    );

    return res.status(201).json({
      success: true,
      message: "Enrolled successfully",
      data: enrollment
    });

  } catch (error) {
    console.error("Enroll Course Error:", error);
    return res.status(500).json({
      success: false,
      message: "Enrollment failed"
    });
  }
};

/* =====================================
   ✅ MY ENROLLMENTS (STUDENT)
===================================== */
exports.getMyEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      studentId: req.user.id,
      status: "active"
    })
      .populate({
        path: "courseId",
        select:
          "title description level category language price averageRating totalEnrollments status"
      })
      .populate({
        path: "roadmapId",
        select: "title description"
      })
      .sort({ enrolledAt: -1 });

    return res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });

  } catch (error) {
    console.error("Get My Enrollments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch enrollments"
    });
  }
};

/* =====================================
   ✅ COURSE ENROLLMENTS (ADMIN)
===================================== */
exports.getCourseEnrollments = async (req, res) => {
  try {
    const enrollments = await Enrollment.find({
      courseId: req.params.id
    })
      .populate({
        path: "studentId",
        select: "name email role"
      })
      .sort({ enrolledAt: -1 });

    return res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });

  } catch (error) {
    console.error("Get Course Enrollments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch course enrollments"
    });
  }
};
