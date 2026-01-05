const express = require("express");
const { setAvailability, getAvailability ,getAvailabilitys,autoCreateSlots,adminCreateSlots} = require("../controllers/availabilityController");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", isAuthenticated, allowRoles("teacher"), setAvailability);
router.get("/", isAuthenticated, allowRoles("teacher", "admin", "student"), getAvailabilitys);

router.post(
    "/getAll",
    isAuthenticated,
    allowRoles("student", "teacher", "admin"),
    getAvailability
);
router.post(
  "/auto-create",
  isAuthenticated,
  allowRoles("admin"),
  autoCreateSlots
);

router.post(
  "/admin-create",
  isAuthenticated,
  allowRoles("admin"),
  adminCreateSlots
);

module.exports = router;
