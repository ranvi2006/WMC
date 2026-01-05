const express = require("express");
const router = express.Router();

const { getSystemHealth } = require("../controllers/monitoringController");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

router.get(
  "/health",
  isAuthenticated,
  allowRoles("admin"),
  getSystemHealth
);

module.exports = router;
