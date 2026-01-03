const express = require("express");
const { createPayment } = require("../controllers/paymentController");
const { isAuthenticated} = require("../middlewares/authMiddleware");
const {allowRoles} = require("../middlewares/roleMiddleware");
const router = express.Router();

router.post("/create", isAuthenticated, allowRoles("student"), createPayment);

module.exports = router;
