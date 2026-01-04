exports.allowRoles = (...roles) => {
  return (req, res, next) => {
    // console.log("Done");
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const userRole = req.user.role;
    console.log("User Role:", userRole);
    console.log("Allowed Roles:", roles);
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }
    next(); // ✅ THIS is the only place next() should be called
  };
};
