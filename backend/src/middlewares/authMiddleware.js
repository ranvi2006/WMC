const jwt = require("jsonwebtoken");
const User = require("../models/User");

// ================= AUTHENTICATION MIDDLEWARE =================
// Verifies JWT token and attaches user to request object
exports.isAuthenticated = async (req, res, next) => {
  try {
    // 1️⃣ Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Authorization required."
      });
    }

    // 2️⃣ Extract token
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Authorization required."
      });
    }

    // 3️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Find user and check if active
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Invalid token."
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Account is disabled."
      });
    }

    // 5️⃣ Attach user to request object (normalize role to lowercase for consistency)
    req.user = {
      id: user._id.toString(),
      role: user.role.toLowerCase(), // Normalize to lowercase for consistency
      email: user.email,
      name: user.name
    };
    console.log(req.user);

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token."
      });
    }

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please login again."
      });
    }

    console.error("AUTH MIDDLEWARE ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Authentication error."
    });
  }
};

