// src/controllers/authController.js

const User = require("../models/User");
const Otp = require("../models/Otp");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const { isFounderEmail } = require("../utils/isFounder");

// ================= UTIL =================
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

// ================= REGISTER =================

exports.registerUser = async (req, res) => {
  try {
    /* =========================================================
       VALIDATION
    ========================================================= */

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    /* =========================================================
       GET DATA
    ========================================================= */

    let { name, email, password, phone, role } = req.body;

    email = email.trim().toLowerCase();

    /* =========================================================
       CHECK EXISTING USER
    ========================================================= */

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User already exists",
      });
    }

    /* =========================================================
       HASH PASSWORD
    ========================================================= */

    const hashedPassword = await bcrypt.hash(password, 10);

    /* =========================================================
       AUTO ADMIN ASSIGNMENT
    ========================================================= */

    role = isFounderEmail(email) ? "admin" : "student";

    /* =========================================================
       CREATE USER
    ========================================================= */

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });

    /* =========================================================
       CLEAN OTP RECORDS
    ========================================================= */

    await Otp.deleteMany({
      email,
      purpose: "register",
    });

    await Otp.deleteMany({
      email,
    });

    /* =========================================================
       GENERATE TOKEN
    ========================================================= */

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },

      process.env.JWT_SECRET,

      {
        expiresIn: "7d",
      },
    );

    /* =========================================================
       RESPONSE
    ========================================================= */

    res.status(201).json({
      success: true,

      message:
        role === "admin" ?
          "Admin account created successfully"
        : "User registered successfully",

      token,

      user: {
        id: user._id,

        name: user.name,

        email: user.email,

        role: user.role,

        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= LOGIN =================
exports.loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    let { email, phone, password } = req.body;
    if (email) email = email.trim().toLowerCase();

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Email or phone is required",
      });
    }

    const user = await User.findOne({
      $or: [email ? { email } : null, phone ? { phone } : null].filter(Boolean),
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is disabled",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    await Otp.deleteMany({
      email: email.trim().toLowerCase(),
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// ================= SEND OTP =================

// ================= VERIFY OTP =================

// ================= RESET PASSWORD =================

const features = require("../config/features");
exports.resetPassword = async (req, res) => {
  try {
    console.log(req.body);
    let { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    email = email.trim().toLowerCase();

    // ================= PRODUCTION OTP CHECK =================

    if (features.requireOtp) {
      if (!otp) {
        return res.status(400).json({
          message: "OTP is required",
        });
      }

      const record = await Otp.findOne({
        email,
        otp: otp.toString(),
      });

      if (!record) {
        return res.status(400).json({
          message: "Invalid OTP",
        });
      }

      if (record.expiresAt < new Date()) {
        await Otp.deleteOne({
          _id: record._id,
        });

        return res.status(400).json({
          message: "OTP expired",
        });
      }

      // delete OTP after success
      await Otp.deleteOne({
        _id: record._id,
      });
    }

    // ================= UPDATE PASSWORD =================

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await User.updateOne({ email }, { password: hashedPassword });

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("RESET PASSWORD ERROR:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
};
