const User = require("../models/User");
const bcrypt = require("bcryptjs");

/* ================= UPDATE PROFILE ================= */
exports.updateUserProfile = async (req, res) => {
  try {
    
    const { name, phone } = req.body;
    console.log(req.user);

    /* ---------- Validation ---------- */
    if (!name || !phone) {
      return res.status(400).json({
        message: "Name and phone are required",
      });
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Phone number must be exactly 10 digits",
      });
    }

    /* ---------- Update ---------- */
  
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        name: name.trim(),
        phone,
      },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");
    console.log("-->",updatedUser);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    /* ---------- Validation ---------- */
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "New password must be at least 6 characters",
      });
    }

    /* ---------- Get User ---------- */
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    /* ---------- Verify Current Password ---------- */
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }

    /* ---------- Hash New Password ---------- */
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });

  } catch (error) {
    console.error("Change password error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};
/* ================= DEACTIVATE ACCOUNT ================= */
exports.deactivateAccount = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;

    if (!userId) {
      return res.status(401).json({
        message: "User not authenticated",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.isActive) {
      return res.status(400).json({
        message: "Account already deactivated",
      });
    }

    user.isActive = false;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Account deactivated successfully",
    });

  } catch (error) {
    console.error("Deactivate account error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

