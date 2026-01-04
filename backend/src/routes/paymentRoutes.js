const express = require("express");
const { createPayment,verifyPayment } = require("../controllers/paymentController");
const { isAuthenticated} = require("../middlewares/authMiddleware");
const {allowRoles} = require("../middlewares/roleMiddleware");
const router = express.Router();

router.post("/create", isAuthenticated, allowRoles("student"), createPayment);
router.post("/verify", isAuthenticated, allowRoles("student"), verifyPayment);

module.exports = router;
