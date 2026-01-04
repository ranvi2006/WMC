const express = require("express");
const {
  bookInterview,
  getMyInterviews,
  getTeacherInterviews,
  cancelInterview,
  updateInterviewStatus,
  addInterviewMeetingLink,
  getInterviewById
} = require("../controllers/interviewController");
const { isAuthenticated} = require("../middlewares/authMiddleware");
const {allowRoles} = require("../middlewares/roleMiddleware");


const router = express.Router();

router.post("/book", isAuthenticated, allowRoles("student"), bookInterview);
router.get("/my", isAuthenticated, allowRoles("student"), getMyInterviews);
router.get("/teacher", isAuthenticated, allowRoles("teacher"), getTeacherInterviews);
router.get("/:id", isAuthenticated, allowRoles("student","teacher","admin"), getInterviewById);
router.delete(
  "/:id/cancel",
  isAuthenticated,
  allowRoles("student", "teacher", "admin"),
  cancelInterview
);
router.patch(
  "/:id/status",
  isAuthenticated,
  allowRoles("teacher", "admin","student"),
  updateInterviewStatus
);
router.patch(
  "/:id/addlink",
  isAuthenticated,
  allowRoles("teacher", "admin"),
  addInterviewMeetingLink
);

module.exports = router;
