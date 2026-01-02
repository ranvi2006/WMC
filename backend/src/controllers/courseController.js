const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const slugify = require("slugify");

// ✅ CREATE COURSE
exports.createCourse = async (req, res) => {
  try {
    // console.log("check 1", req.body);

    const course = await Course.create({
      ...req.body,
      slug: slugify(req.body.title, { lower: true, strict: true }), // ✅ FIX
      price: Number(req.body.price),
      createdBy: req.user.id,
      publishedAt:
        req.body.status === "published" ? new Date() : null
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      data: course
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.code === 11000
        ? "Course with this title already exists"
        : error.message
    });
  }
};


// ✅ UPDATE COURSE
exports.updateCourse = async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "description",
      "category",
      "level",
      "language",
      "price",
      "status",
      "tags",
      "thumbnail",
      "isFeatured",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // ✅ Ownership check
    if (
      course.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    // ✅ Apply updates safely
    Object.assign(course, updates);

    // ✅ Auto set publish date
    if (updates.status === "published" && !course.publishedAt) {
      course.publishedAt = new Date();
    }

    await course.save();

    res.status(200).json({
      success: true,
      message: "Course updated successfully",
      data: course,
    });
  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


// ✅ DELETE COURSE (ARCHIVE)
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    if (
      course.createdBy.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    course.status = "archived";
    await course.save();

    res.json({
      success: true,
      message: "Course archived successfully"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET ALL PUBLISHED COURSES
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find({ status: "published" })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET SINGLE COURSE
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("createdBy", "name role")
      // .populate("roadmap");

    if (!course || course.status !== "published") {
      return res.status(404).json({ success: false, message: "Course not found" });
    }

    res.json({ success: true, data: course });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ GET INSTRUCTOR COURSES
exports.getMyCourses = async (req, res) => {
  try {
    const courses = await Course.find({ createdBy: req.user.id });

    res.json({ success: true, data: courses });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllUserCourses = async (req, res) => {
  try {
    const { id } = req.params; // studentId from URL

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'Student ID is required'
      });
    }


    const enrollments = await Enrollment.find({ studentId: id })
      .populate({
        path: 'courseId',
        select: 'title description level category language price averageRating totalEnrollments status'
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: enrollments.length,
      data: enrollments
    });

  } catch (error) {
    console.error('Get User Courses Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching user courses'
    });
  }
};
