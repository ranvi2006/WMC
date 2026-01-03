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
module.exports = {
  setAvailability,
  getAvailability
};
