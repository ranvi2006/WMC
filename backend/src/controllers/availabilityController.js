const Availability = require("../models/Availability");

const setAvailability = async (req, res) => {
  const { date, slots } = req.body;

  const availability = await Availability.findOneAndUpdate(
    { teacherId: req.user.id, date },
    { slots },
    { upsert: true, new: true }
  );

  res.status(200).json({
    success: true,
    availability,
  });
};


const getAvailability = async (req, res) => {
  // console.log("getAvailability called with body:", req.body);
  const { date } = req.body;

  const availability = await Availability.find({
    date: date,
  });

  res.status(200).json({
    success: true,
    availability,
  });
};

 const getAvailabilitys = async (req, res) => {
  console.log("getAvailabilitys called with query:", req.query);
  const { date } = req.query;

  const query = date ? { date } : {};

  const availability = await Availability.find(query)
    .populate("teacherId", "name email");

  res.status(200).json({
    success: true,
    availability,
  });
};
const autoCreateSlots = async (req, res) => {

  try {
    const DEFAULT_SLOTS = [
  { startTime: "10:00", endTime: "10:30" },
  { startTime: "11:00", endTime: "11:30" },
  { startTime: "14:00", endTime: "14:30" },
  { startTime: "15:00", endTime: "15:30" },
];
    const { dates } = req.body; // ["2026-01-10", "2026-01-12"]

    if (!dates || dates.length === 0) {
      return res.status(400).json({ message: "Dates required" });
    }

    // 1️⃣ Get all teachers
    const teachers = await User.find({ role: "teacher" });

    if (teachers.length === 0) {
      return res.status(400).json({ message: "No teachers found" });
    }

    // 2️⃣ Loop teachers & dates
    for (const teacher of teachers) {
      for (const date of dates) {
        // Prevent duplicate creation
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

    res.json({
      success: true,
      message: "Slots created successfully",
      teachers: teachers.length,
      dates: dates.length,
      slotsPerTeacher: DEFAULT_SLOTS.length,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const adminCreateSlots = async (req, res) => {
  try {
    const { teacherIds, date } = req.body;

    if (!teacherIds.length || !date) {
      return res.status(400).json({ message: "Teacher & date required" });
    }

    // ❌ Prevent Sunday
    const day = new Date(date).getDay();
    if (day === 0) {
      return res.status(400).json({ message: "Sunday not allowed" });
    }

    const DEFAULT_SLOTS = [
      { startTime: "10:00", endTime: "10:30" },
      { startTime: "11:00", endTime: "11:30" },
      { startTime: "14:00", endTime: "14:30" },
      { startTime: "15:00", endTime: "15:30" },
    ];

    for (const teacherId of teacherIds) {
      const exists = await Availability.findOne({ teacherId, date });
      if (exists) continue; // ❌ prevent duplicate

      await Availability.create({
        teacherId,
        date,
        slots: DEFAULT_SLOTS.map(s => ({ ...s, isBooked: false })),
      });
    }

    res.json({ success: true, message: "Slots created successfully" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  setAvailability,
  getAvailability,
  getAvailabilitys,
  autoCreateSlots,
  adminCreateSlots
};
