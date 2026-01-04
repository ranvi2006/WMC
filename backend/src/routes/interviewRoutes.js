const express = require("express");
const {
  bookInterview,
  getMyInterviews,
  getTeacherInterviews,
  cancelInterview,
  updateInterviewStatus,
  addInterviewMeetingLink,
  getInterviewById,
  getAllInterviewsAdmin,
  adminCancelInterview
} = require("../controllers/interviewController");

const { isAuthenticated } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

/* =======================
   STATIC ROUTES FIRST
======================= */

// Admin
router.get(
  "/admin",
  isAuthenticated,
  allowRoles("admin"),
  getAllInterviewsAdmin
);

// Student / Teacher lists
router.get("/my", isAuthenticated, allowRoles("student"), getMyInterviews);
router.get("/teacher", isAuthenticated, allowRoles("teacher"), getTeacherInterviews);

// Booking
router.post("/book", isAuthenticated, allowRoles("student"), bookInterview);

/* =======================
   DYNAMIC ROUTES LAST
======================= */

router.get(
  "/:id",
  isAuthenticated,
  allowRoles("student", "teacher", "admin"),
  getInterviewById
);

router.delete(
  "/:id/cancel",
  isAuthenticated,
  allowRoles("student", "teacher", "admin"),
  cancelInterview
);

router.patch(
  "/:id/status",
  isAuthenticated,
  allowRoles("teacher", "admin", "student"),
  updateInterviewStatus
);

router.patch(
  "/:id/addlink",
  isAuthenticated,
  allowRoles("teacher", "admin"),
  addInterviewMeetingLink
);

router.patch(
  "/:id/admin-cancel",
  isAuthenticated,
  allowRoles("admin"),
  adminCancelInterview
);

module.exports = router;
