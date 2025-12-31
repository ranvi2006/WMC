const express = require("express");
const router = express.Router();

const {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  getCourseById,
  getMyCourses
} = require("../controllers/courseController");

const { isAuthenticated } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

// Create course
router.post(
  "/",
  isAuthenticated,
  allowRoles("admin", "instructor"),
  createCourse
);

// Update course
router.put(
  "/:id",
  isAuthenticated,
  allowRoles("admin", "instructor"),
  updateCourse
);

// Delete (archive) course
router.delete(
  "/:id",
  isAuthenticated,
  allowRoles("admin", "instructor"),
  deleteCourse
);

// Public
router.get("/", getAllCourses);

// Instructor - must be before /:id route
router.get(
  "/my/courses",
  isAuthenticated,
  allowRoles("instructor"),
  getMyCourses
);

// Public - parameterized route must come after specific routes
router.get("/:id", getCourseById);

module.exports = router;
