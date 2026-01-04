const express = require("express");
const router = express.Router();

const {
  createRescheduleRequest,
  getTeacherRequests,
  approveRequest,
  rejectRequest,
} = require("../controllers/rescheduleController");

const { isAuthenticated } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

// student
router.post(
  "/",
  isAuthenticated,
  allowRoles("student"),
  createRescheduleRequest
);

// teacher
router.get(
  "/teacher",
  isAuthenticated,
  allowRoles("teacher"),
  getTeacherRequests
);

router.post(
  "/:id/approve",
  isAuthenticated,
  allowRoles("teacher"),
  approveRequest
);

router.post(
  "/:id/reject",
  isAuthenticated,
  allowRoles("teacher"),
  rejectRequest
);

module.exports = router;
