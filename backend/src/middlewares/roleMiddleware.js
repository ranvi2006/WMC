// ================= ROLE-BASED AUTHORIZATION MIDDLEWARE =================
// Checks if user has one of the required roles
// Usage: allowRoles("admin", "instructor") or allowRoles("student")

exports.allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // 1️⃣ Check if user is authenticated (should be set by authMiddleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required."
      });
    }

    // 2️⃣ Normalize roles: convert to lowercase for comparison
    // authMiddleware already normalizes user.role to lowercase
    // Routes use: "student", "instructor", "admin"
    const userRole = req.user.role.toLowerCase();
    const normalizedAllowedRoles = allowedRoles.map(role => role.toLowerCase());

    // 3️⃣ Check if user role is in allowed roles
    if (!normalizedAllowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required roles: ${allowedRoles.join(", ")}.`
      });
    }

    next();
  };
};

