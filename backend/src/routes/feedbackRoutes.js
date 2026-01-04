const express = require("express");
const router = express.Router();

const { giveFeedback,getFeedbackByInterview } = require("../controllers/feedbackController");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

router.post(
  "/",
  isAuthenticated,
  allowRoles("teacher"),
  giveFeedback
);
router.get(
  "/:interviewId",
  isAuthenticated,
  allowRoles("student", "teacher", "admin"),
  getFeedbackByInterview
);


module.exports = router;
