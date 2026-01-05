const express = require("express");
const router = express.Router();

const { getErrorLogs } = require("../controllers/errorController");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

router.get(
  "/",
  isAuthenticated,
  allowRoles("admin"),
  getErrorLogs
);

module.exports = router;
