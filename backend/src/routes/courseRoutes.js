const express = require("express");
const router = express.Router();

const {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getMyCourses,
  getAllUserCourses
} = require("../controllers/courseController");

const { isAuthenticated } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

// Create course
router.post(
  "/",
  isAuthenticated,
  allowRoles("admin", "teacher"),
  createCourse
);

// Update course
router.put(
  "/:id",
  isAuthenticated,
  allowRoles("admin", "teacher"),
  updateCourse
);

// Delete (archive) course
router.delete(
  "/:id",
  isAuthenticated,
  allowRoles("admin"),
  deleteCourse
);

// Public
router.get("/", getAllCourses);

// Instructor courses
router.get(
  "/my",
  isAuthenticated,
  allowRoles("teacher"),
  getMyCourses
);

// User courses
router.get("/user/:id/courses", getAllUserCourses);

// Public single course (LAST)
router.get("/:id", getCourseById);

module.exports = router;
