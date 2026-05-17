const express = require("express");

const {
  setAvailability,
  getAvailability,
  autoCreateSlots,
  adminCreateSlots,
} = require("../controllers/availabilityController");

const { isAuthenticated } = require("../middlewares/authMiddleware");

const { allowRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

/* =========================================================
   GET AVAILABILITY
========================================================= */

router.get(
  "/",
  isAuthenticated,
  allowRoles("teacher", "admin", "student"),
  getAvailability,
);

/* =========================================================
   SET AVAILABILITY
========================================================= */

router.post("/", isAuthenticated, allowRoles("teacher"), setAvailability);

/* =========================================================
   AUTO CREATE SLOTS
========================================================= */

router.post(
  "/auto-create",
  isAuthenticated,
  allowRoles("admin"),
  autoCreateSlots,
);

/* =========================================================
   ADMIN CREATE SLOTS
========================================================= */

router.post(
  "/admin-create",
  isAuthenticated,
  allowRoles("admin"),
  adminCreateSlots,
);

module.exports = router;
