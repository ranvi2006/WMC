const express = require("express");
const {
  getAllInterviews,
  getAllPayments,
} = require("../controllers/adminController");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const {allowRoles} = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/interviews", isAuthenticated, allowRoles("admin"), getAllInterviews);
router.get("/payments", isAuthenticated, allowRoles("admin"), getAllPayments);

module.exports = router;
