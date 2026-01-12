const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const Interview = require("../models/Interview");
const Payment = require("../models/Payment");
const Feedback = require("../models/Feedback");
const ErrorLog = require("../models/ErrorLog");
const Roadmap = require("../models/Roadmap");
const RescheduleRequest = require("../models/RescheduleRequest");



const { isFounderEmail } = require("../utils/isFounder");

const getAllInterviews = async (req, res) => {
  const interviews = await Interview.find()
    .populate("studentId teacherId");

  res.json({ success: true, interviews });
};

const getAllPayments = async (req, res) => {
  const payments = await Payment.find().populate("userId");
  res.json({ success: true, payments });
};

// ✅ ADD THIS FUNCTION
const getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find(
      { role: "teacher" },
      "name email" // only needed fields
    );

    res.json({
      success: true,
      teachers,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // const isFounder = isFounderEmail(req.user.email);
    const founderEmail=req?.user?.email;
    const users = await User.find()
      .select("-password") // 🔒 never send password
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users:users,
      isFounder:isFounderEmail(founderEmail)
    });
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;

    // 🔒 Only Founder / Co-Founder
    if (!isFounderEmail(req.user.email)) {
      return res.status(403).json({
        message: "Only Founder or Co-Founder can update roles"
      });
    }

    await User.findByIdAndUpdate(userId, { role });

    res.status(200).json({
      success: true,
      message: "Role updated successfully"
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
const getAdminAnalytics = async (req, res) => {
  try {
    /* ================= DATE HELPERS ================= */
    const last30Days = new Date();
    last30Days.setDate(last30Days.getDate() - 30);

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    /* ================= OVERVIEW ================= */
    const [
      totalUsers,
      activeUsers,
      totalCourses,
      totalEnrollments,
      totalInterviews,
      totalRevenueAgg,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: true }),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      Interview.countDocuments(),
      Payment.aggregate([
        { $match: { status: "success" } },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const totalRevenue = totalRevenueAgg[0]?.total || 0;

    /* ================= USERS ================= */
    const [
      verifiedUsers,
      unverifiedUsers,
      inactiveUsers,
      newUsers30d,
    ] = await Promise.all([
      User.countDocuments({ isVerified: true }),
      User.countDocuments({ isVerified: false }),
      User.countDocuments({ isActive: false }),
      User.countDocuments({ createdAt: { $gte: last30Days } }),
    ]);

    /* ================= COURSES ================= */
    const courses = await Course.aggregate([
      {
        $lookup: {
          from: "enrollments",
          localField: "_id",
          foreignField: "courseId",
          as: "enrollments",
        },
      },
      {
        $lookup: {
          from: "roadmaps",
          localField: "_id",
          foreignField: "courseId",
          as: "roadmaps",
        },
      },
      {
        $project: {
          name: 1,
          enrollments: { $size: "$enrollments" },
          completed: {
            $size: {
              $filter: {
                input: "$enrollments",
                as: "e",
                cond: { $eq: ["$$e.completed", true] },
              },
            },
          },
          hasRoadmap: { $gt: [{ $size: "$roadmaps" }, 0] },
        },
      },
    ]);

    /* ================= INTERVIEWS ================= */
    const [
      scheduledInterviews,
      completedInterviews,
      cancelledInterviews,
      pendingToday,
      rescheduleRequests,
    ] = await Promise.all([
      Interview.countDocuments(),
      Interview.countDocuments({ status: "completed" }),
      Interview.countDocuments({ status: "cancelled" }),
      Interview.countDocuments({
        date: { $gte: todayStart },
        status: "pending",
      }),
      RescheduleRequest.countDocuments({ status: "pending" }),
    ]);

    /* ================= PAYMENTS ================= */
    const [
      successfulPayments,
      failedPayments,
      thisMonthRevenueAgg,
    ] = await Promise.all([
      Payment.countDocuments({ status: "success" }),
      Payment.countDocuments({ status: "failed" }),
      Payment.aggregate([
        {
          $match: {
            status: "success",
            createdAt: { $gte: last30Days },
          },
        },
        { $group: { _id: null, total: { $sum: "$amount" } } },
      ]),
    ]);

    const thisMonthRevenue = thisMonthRevenueAgg[0]?.total || 0;

    /* ================= FEEDBACK ================= */
    const feedbackAgg = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          averageRating: { $avg: "$rating" },
          negativeCount: {
            $sum: {
              $cond: [{ $lt: ["$rating", 3] }, 1, 0],
            },
          },
        },
      },
    ]);

    const feedbacks = feedbackAgg[0] || {
      total: 0,
      averageRating: 0,
      negativeCount: 0,
    };

    /* ================= SYSTEM ================= */
    const [
      errorsLast24h,
      criticalErrors,
    ] = await Promise.all([
      ErrorLog.countDocuments({
        createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      }),
      ErrorLog.countDocuments({ level: "critical" }),
    ]);

    /* ================= RECENT ACTIVITY ================= */
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .select("name");

    const recentPayments = await Payment.find({ status: "success" })
      .sort({ createdAt: -1 })
      .limit(3)
      .select("amount");

    const recentActivity = [
      ...recentUsers.map((u) => `New user registered: ${u.name}`),
      ...recentPayments.map((p) => `Payment completed: ₹${p.amount}`),
    ];

    /* ================= RESPONSE ================= */
    return res.status(200).json({
      overview: {
        totalUsers,
        activeUsers,
        totalCourses,
        totalEnrollments,
        totalInterviews,
        totalRevenue,
      },

      users: {
        verified: verifiedUsers,
        unverified: unverifiedUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        newLast30Days: newUsers30d,
      },

      courses,

      interviews: {
        scheduled: scheduledInterviews,
        completed: completedInterviews,
        cancelled: cancelledInterviews,
        pendingToday,
        rescheduleRequests,
      },

      payments: {
        totalRevenue,
        thisMonth: thisMonthRevenue,
        successful: successfulPayments,
        failed: failedPayments,
      },

      feedbacks,

      system: {
        errorsLast24h,
        criticalErrors,
      },

      recentActivity,
    });

  } catch (error) {
    console.error("Admin analytics error:", error);
    return res.status(500).json({
      message: "Failed to load analytics",
    });
  }
};

module.exports = {
  getAllInterviews,
  getAllPayments,
  getAllTeachers, // 👈 EXPORT IT
  getAllUsers,
  updateUserRole,
  getAdminAnalytics
};
