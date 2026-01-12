const express = require("express");
const {
  getAllInterviews,
  getAllPayments,
  getAllTeachers, // 👈 ADD
  getAllUsers,
  updateUserRole,
  getAdminAnalytics,
} = require("../controllers/adminController");

const { isAuthenticated } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.get("/interviews", isAuthenticated, allowRoles("admin"), getAllInterviews);
router.get("/payments", isAuthenticated, allowRoles("admin"), getAllPayments);

// ✅ ADD THIS ROUTE
router.get("/teachers", isAuthenticated, allowRoles("admin"), getAllTeachers);
router.get("/users", isAuthenticated, allowRoles("admin"), getAllUsers);
router.put("/users/role", isAuthenticated, allowRoles("admin"), updateUserRole);
router.get(
  "/analytics",
  isAuthenticated,
  allowRoles("admin"),
  getAdminAnalytics
);

module.exports = router;
