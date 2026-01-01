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
  allowRoles("ADMIN", "TEACHER"),
  createCourse
);

// Update course
router.put(
  "/:id",
  isAuthenticated,
  allowRoles("ADMIN", "TEACHER"),
  updateCourse
);

// Delete (archive) course
router.delete(
  "/:id",
  isAuthenticated,
  allowRoles("ADMIN", "TEACHER"),
  deleteCourse
);

// Public
router.get("/", getAllCourses);

// Instructor - must be before /:id route
router.get(
  "/my/courses",
  isAuthenticated,
  allowRoles("TEACHER"),
  getMyCourses
);

// Public - parameterized route must come after specific routes
router.get("/:id", getCourseById);

// Get all user courses
router.get('/user/:id/courses', getAllUserCourses);

module.exports = router;
