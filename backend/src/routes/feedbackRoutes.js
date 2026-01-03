const express = require("express");
const router = express.Router();

const { giveFeedback } = require("../controllers/feedbackController");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

router.post(
  "/",
  isAuthenticated,
  allowRoles("teacher"),
  giveFeedback
);

module.exports = router;
