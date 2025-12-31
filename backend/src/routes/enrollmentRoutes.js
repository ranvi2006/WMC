const express = require("express");
const router = express.Router();

const {
  enrollCourse,
  getMyEnrollments,
  getCourseEnrollments
} = require("../controllers/enrollmentController");

const { isAuthenticated } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

// Student enroll
router.post(
  "/",
  isAuthenticated,
  allowRoles("student"),
  enrollCourse
);

// Student dashboard
router.get(
  "/my",
  isAuthenticated,
  allowRoles("student"),
  getMyEnrollments
);

// Admin analytics
router.get(
  "/course/:id",
  isAuthenticated,
  allowRoles("admin"),
  getCourseEnrollments
);

module.exports = router;
