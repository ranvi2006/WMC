const express = require("express");
const router = express.Router();

const { isAuthenticated } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

const {
  updateUserProfile,
  changePassword,
  deactivateAccount,
} = require("../controllers/userController");

router.patch(
  "/profile/update",
  isAuthenticated,
  allowRoles("student", "teacher", "admin"),
  updateUserProfile
);
router.patch(
  "/change-password",
  isAuthenticated,
  allowRoles("student", "teacher", "admin"),
  changePassword
);
router.patch(
  "/deactivate",
  isAuthenticated,
  allowRoles("student", "teacher", "admin"),
  deactivateAccount
);

module.exports = router;
