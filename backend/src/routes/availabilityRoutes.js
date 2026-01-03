const express = require("express");
const { setAvailability, getAvailability } = require("../controllers/availabilityController");
const { isAuthenticated } = require("../middlewares/authMiddleware");
const { allowRoles } = require("../middlewares/roleMiddleware");

const router = express.Router();

router.post("/", isAuthenticated, allowRoles("teacher"), setAvailability);

router.post(
    "/getAll",
    isAuthenticated,
    allowRoles("student", "teacher", "admin"),
    getAvailability
);

module.exports = router;
