const express = require("express");
const router = express.Router();

const { registerUser,loginUser ,resetPassword} = require("../controllers/authController");
const { registerValidation,loginValidation } = require("../validations/userValidation");
router.post("/register", registerValidation, registerUser);
router.post("/login", loginValidation, loginUser);
router.post("/reset-password", resetPassword);

module.exports = router;
