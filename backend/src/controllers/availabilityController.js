const Availability = require("../models/Availability");
const User = require("../models/User");

/* =========================================================
   SET AVAILABILITY
========================================================= */

const setAvailability = async (req, res) => {
  try {
    const { date, slots } = req.body;

    if (!date || !slots) {
      return res.status(400).json({
        success: false,
        message: "Date and slots are required",
      });
    }

    const availability = await Availability.findOneAndUpdate(
      {
        teacherId: req.user.id,
        date,
      },
      {
        slots,
      },
      {
        upsert: true,
        new: true,
      },
    );

    return res.status(200).json({
      success: true,
      availability,
    });
  } catch (error) {
    console.error("SET AVAILABILITY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================
   GET AVAILABILITY
========================================================= */

const getAvailability = async (req, res) => {
  try {
    const { date } = req.query;

    const query = date ? { date } : {};

    const availability = await Availability.find(query).populate(
      "teacherId",
      "name email",
    );

    /* =========================================================
       REMOVE BROKEN RECORDS
    ========================================================= */

    const cleanAvailability = availability.filter((item) => item.teacherId);

    return res.status(200).json({
      success: true,
      availability: cleanAvailability,
    });
  } catch (error) {
    console.error("GET AVAILABILITY ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch availability",
    });
  }
};

/* =========================================================
   AUTO CREATE SLOTS
========================================================= */

const autoCreateSlots = async (req, res) => {
  try {
    const DEFAULT_SLOTS = [
      {
        startTime: "10:00",
        endTime: "10:30",
      },
      {
        startTime: "11:00",
        endTime: "11:30",
      },
      {
        startTime: "14:00",
        endTime: "14:30",
      },
      {
        startTime: "15:00",
        endTime: "15:30",
      },
    ];

    const { dates } = req.body;

    if (!dates || dates.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Dates required",
      });
    }

    const teachers = await User.find({
      role: "teacher",
    });

    if (teachers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No teachers found",
      });
    }

    for (const teacher of teachers) {
      for (const date of dates) {
        const exists = await Availability.findOne({
          teacherId: teacher._id,
          date,
        });

        if (exists) continue;

        await Availability.create({
          teacherId: teacher._id,

          date,

          slots: DEFAULT_SLOTS.map((slot) => ({
            ...slot,
            isBooked: false,
          })),
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "Slots created successfully",
      teachers: teachers.length,
      dates: dates.length,
      slotsPerTeacher: DEFAULT_SLOTS.length,
    });
  } catch (error) {
    console.error("AUTO CREATE SLOTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =========================================================
   ADMIN CREATE SLOTS
========================================================= */

const adminCreateSlots = async (req, res) => {
  try {
    const { teacherIds, date } = req.body;

    if (!teacherIds?.length || !date) {
      return res.status(400).json({
        success: false,
        message: "Teacher IDs and date are required",
      });
    }

    /* =========================================================
       PREVENT SUNDAY
    ========================================================= */

    const day = new Date(date).getDay();

    if (day === 0) {
      return res.status(400).json({
        success: false,
        message: "Sunday not allowed",
      });
    }

    const DEFAULT_SLOTS = [
      {
        startTime: "10:00",
        endTime: "10:30",
      },
      {
        startTime: "11:00",
        endTime: "11:30",
      },
      {
        startTime: "14:00",
        endTime: "14:30",
      },
      {
        startTime: "15:00",
        endTime: "15:30",
      },
    ];

    for (const teacherId of teacherIds) {
      const exists = await Availability.findOne({
        teacherId,
        date,
      });

      if (exists) continue;

      await Availability.create({
        teacherId,

        date,

        slots: DEFAULT_SLOTS.map((slot) => ({
          ...slot,
          isBooked: false,
        })),
      });
    }

    return res.status(200).json({
      success: true,
      message: "Slots created successfully",
    });
  } catch (error) {
    console.error("ADMIN CREATE SLOTS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  setAvailability,
  getAvailability,
  autoCreateSlots,
  adminCreateSlots,
};
